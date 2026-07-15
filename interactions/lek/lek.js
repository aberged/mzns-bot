import { ephemeralTextResponese } from '../../responses.js';
import { ICON_BUG } from '../../commands.js';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { InteractionResponseType } from 'discord-interactions';
import { DiscordRequest, splitString } from '../../utils.js';


export async function lek(req, res) {
  const { data } = req.body;
  // Interaction context
  const context = req.body.context;
  // User ID is in user field for (G)DMs, and member for servers
  const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
  // Get text input values
  const textToLek = data.options.find(opt => opt.name === 'tekst')?.value || 'dje tekst?!';
  const stil = data.options.find(opt => opt.name === 'stil')?.value || null;
  const pismo = data.options.find(opt => opt.name === 'pismo')?.value || 'latinica';


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
    const model = 'gemini-3.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Izlektoriši tekst na srpskom jeziku. Pronađi i ispravi slovne, pravopisne i gramatičke greške ${stil ? ' i stilski ga doradi (da zvuči prirodnije i profesionalnije)' : ''}. Ne haluciniraj. Nakon ispravljenog teksta taksativno navedi šta je sve izmenjeno i taj deo odgovora započni sa <!-- izneme --> tagom. Ukoliko nema izmena, vrati originalni tekst. Odgovori ${pismo === 'latinica' ? 'latiničnim' : 'ćiriličnim'} pismom. Ovo je tekst:\n${textToLek}`,
          },
        ],
      },
    ];

    ai.models.generateContentStream({
      model,
      config,
      contents,
    }).then(async response => {
      console.log(`Lektura gotova, šaljem odgovor za korisnika ${userId} ...`);
      let fullResponse = '';
      for await (const chunk of response) {
        fullResponse += chunk.text;
      }
      //console.log('full response: ', fullResponse);
      const responseParts = fullResponse.split('<!-- izneme -->');
      const responseText = responseParts.length > 0 ? responseParts[0].trim() : 'no response';
      const responseTextArr = splitString(responseText, 2000);
      for (let i = 0; i < responseTextArr.length; i++) {
        await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}`, {
          method: 'POST',
          body: { content: responseTextArr[i], flags: 1 << 6 }
        });
      }
      if (responseParts.length > 1) {
        const explanationText = splitString(responseParts[1].trim(), 2000);
        for (let i = 0; i < explanationText.length; i++) {
          await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}`, {
            method: 'POST',
            body: { content: `**Šta je izmenjeno:**\n${explanationText[i]}`, flags: 1 << 6 }
          });
        }
      }
    })
    .catch(async err => {
      console.error(`Error during lektura(${userId}):`, err);
      await DiscordRequest(`webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
        method: 'PATCH',
        body: { content: `${ICON_BUG} [error] Pošlo po zlu tokom lekture: ${err.message.error || err}` }
      });
    });

    return res.send(
      ephemeralTextResponese('', InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
    );
  } catch (err) {
    console.error(`Error llm lektura(${userId}):`, err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
}






