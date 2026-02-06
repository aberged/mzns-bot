import { client } from "../app.js";
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { componentsResponese, ephemeralTextResponese, simpleTextResponese } from "../responses.js";
import { InteractionResponseType } from "discord-interactions";

export const WELCOME_ROLE_SELECT_ID = 'select_roles';

export function welcome() {
  client.on('guildMemberAdd', async member => {
    console.log('New member joined:', member.displayName, member.user.tag, member.id);
    const channel = member.guild.channels.cache.get('1466011115736662201');
    if (!channel) return;
  
    // 1. Create a Buffer object from the Base64 string, specifying the input encoding
    const bufferObject = Buffer.from(process.env.ROLE_LIST || 'W10=', 'base64');
    // 2. Convert the Buffer to a human-readable string, specifying the desired output encoding (e.g., 'utf-8')
    // decoded string is a json array [{"label": "role label", "value": "role id"}, ...]
    const decodedString = bufferObject.toString('utf-8');
    const options = JSON.parse(decodedString);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`👋 Dobrodošao/la u MZNS!`)
      .setDescription(
        `${member}, izaberi role i platforme koje te zanimaju 👇`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: member.guild.name });
  

    const rolesRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${WELCOME_ROLE_SELECT_ID}:${member.user.id}`)
        .setPlaceholder('Izaberi role')
        .setMinValues(options.length > 0 ? 1 : 0)
        .setMaxValues(options.length)
        .addOptions(options)
    );
  
    await channel.send({
      content: `${member}`,
      embeds: [embed],
      components: [rolesRow]
    });
  });

  console.log('Welcome message and role selection setup initialized. Listening for new members...');
} 

export async function handleWelcomeRoleSelection(req, res) {
  const data = req.body.data;
  const userId = data.custom_id.split(':')[1];
  if (userId !== req.body.member.user.id) {
    console.warn(`User ${req.body.member.user.id} tried to select roles for user ${userId}`);
    return res.send(
      ephemeralTextResponese(`❌ Ove role može izabrati samo <@${userId}>!`, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE)
    );
  }
  if (data.values.length === 0) {
    // can this happen???
    console.warn(`User ${userId} tried to select no roles`);
    return res.send(
      ephemeralTextResponese(`⚠️ Odaberi barem jednu rolu!`, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE)
    );
  }
  const member = req.body.member;
  const user = await client.guilds.cache.get(req.body.guild_id).members.fetch(member.user.id);
  const selectedRoles = data.values.map(v => `<@&${v}>`).join(' ');
  try {
    await user.roles.add(data.values);
    console.log(`Updated roles for user ${userId}: ${selectedRoles}`);
    return res.send(
      componentsResponese({ content: `✅ Role ${selectedRoles} su uspešno dodeljene!`, components: [] }, InteractionResponseType.UPDATE_MESSAGE)
    );
  } catch (err) {
    console.error('Error assigning roles:', err);
    return res.send(
      simpleTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
}
