import { AttachmentBuilder } from 'discord.js';
import QRCode from 'qrcode';
import { client } from '../../app.js';
import { ephemeralTextResponese, simpleTextResponese } from '../../responses.js';
import { ICON_BUG } from '../../commands.js';


export async function qr(req, res) {
  const { data, channel } = req.body;
  try {
    const qr = await QRCode.toBuffer(data.options[0].value);
    const attachment = new AttachmentBuilder(qr, { name: "qr.png", title: `QR code generated from ${data.options[0].value}` });
    const ch = await client.channels.fetch(channel.id);
    ch.send({ files: [attachment] }).then(() => {
      console.log('Sent QR code image to channel:', channel.id);
    }).catch(err => {
      console.error('Error sending QR code image to channel:', err);
    });
    console.log('Generated QR code from:', data.options[0].value, 'in channel:', channel.id);
    return res.send(
      simpleTextResponese(`👇 :[qr]: ${data.options[0].value}`)
    );
  } catch (err) {
    console.error('Error generating QR code:', err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
}
