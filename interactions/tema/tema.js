import { ICON_SUCCESS, ICON_WARNING } from '../../commands.js';
import { ephemeralTextResponese } from '../../responses.js';
import { DiscordRequest } from '../../utils.js';

export async function tema(req, res) {
  // Interaction id, type, data, channel and member/user info
  const { data, channel, member } = req.body;

  // get user ID of member who filled out modal
  const userId = member.user.id;

  // Get value of text inputs
  const temaName = data.options.length > 0 ? data.options[0].value : 'No name tema';

  if (channel.thread_metadata) {
    return res.send(
      ephemeralTextResponese(`${ICON_WARNING} Teme se mogu otvoriti samo u kanalima, ne i tredovima.`)
    );
  }
  //create thread/tema with the given name
  const endpoint = `channels/${channel.id}/threads`;
  try {
    const cretedThread = await DiscordRequest(endpoint, {
      method: 'POST', body: {
        name: TEMA_ICON + ' ' + temaName,
        auto_archive_duration: 10080,
        type: 11, //Type 11 is for public threads
        rate_limit_per_user: 0
      }
    });
    //if mentions present post in thread
    //const threadRes = await cretedThread.json();
    console.log('created tema', TEMA_ICON + ' ' + temaName, channel.id, userId);
  } catch (err) {
    console.error(`[error] creating tema [userId:${userId}, tema: ${temaName}] - `, err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
  return res.send(
    ephemeralTextResponese(`${ICON_SUCCESS} [tema][new] ${TEMA_ICON + ' ' + temaName} 👇`)
  );
}
