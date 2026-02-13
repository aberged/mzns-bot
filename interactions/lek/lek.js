import { ephemeralTextResponese } from '../../responses.js';
import { ICON_BUG } from '../../commands.js';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { InteractionResponseType } from 'discord-interactions';
import { DiscordRequest } from '../../utils.js';


export async function lek(req, res) {
  const { data } = req.body;
  // Get text input values
  const textToLek = data.options.find(opt => opt.name === 'tekst')?.value || 'dje tekst?!';
  const stil = data.options.find(opt => opt.name === 'stil')?.value || null;

  try {
    // send a message and wait for the response
    /*
    * gemini
    */
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const tools = [
      {
        googleSearch: {
        }
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      tools,
    };
    const model = 'gemini-3-pro-preview';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Izlektoriši tekst na srpskom jeziku. Pronađi i ispravi slovne, pravopisne i gramatičke greške ${stil ? ' i stilski ga doradi (da zvuči prirodnije i profesionalnije)' : ''}. Ne haluciniraj. Nakon ispravljenog teksta taksativno navedi šta je sve izmenjeno i taj deo odgovora započni sa <!-- izneme --> tagom. Ukoliko nema izmena, vrati originalni tekst. Ovo je tekst:\n${textToLek}`,
          },
        ],
      },
    ];

    ai.models.generateContentStream({
      model,
      config,
      contents,
    }).then(async response => {
      console.log('Lektura gotova, šaljem odgovor...');
      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }
      //console.log('full response: ', fullResponse);
      const responseParts = fullResponse.split('<!-- izneme -->');
      await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}`, {
        method: 'POST',//'PATCH',
        body: { content: responseParts.length > 0 ? responseParts[0].trim() : 'no response', flags: 1 << 6 }
      });
      if (responseParts.length > 1) {
        await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}`, {
          method: 'POST',
          body: { content: `**Šta je izmenjeno:**\n${responseParts[1].trim()}`, flags: 1 << 6 }
        });
      }
    })
    .catch(async err => {
      console.error('Error during lektura:', err);
      await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
        method: 'PATCH',
        body: { content: `${ICON_BUG} [error] Pošlo po zlu tokom lekture: ${err.message.error || err}` }
      });
    });

    return res.send(
      ephemeralTextResponese('', InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
    );
  } catch (err) {
    console.error('Error llm lektura:', err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
}






