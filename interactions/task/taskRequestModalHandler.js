import { ICON_BUG, ICON_SUCCESS } from '../../commands.js';
import { ephemeralTextResponese } from '../../responses.js';
import { AUTO_ARCHIVE_DURATION, DiscordRequest } from '../../utils.js';

export async function taskRequestModalHandler(req, res) {
  // get data, channel and member/user info from interaction payload
  const { data, channel, member } = req.body;

  // get modal custom_id
  const modalId = data.custom_id;
  // get user ID of member who filled out modal
  const userId = member.user.id;

  // extract task command from modal custom_id
  const modalIdNameComponents = modalId.split('_');
  const taskCommand = modalIdNameComponents.length > 1 ? modalIdNameComponents[2] : '';

  // Get value of text inputs
  const textInputComponent = data.components.length > 0 ? data.components[0].components[0] : { value: 'No name task' };
  const taskName = textInputComponent.value;

  // Get values of role select and user select (if any)
  let mentions = '';
  const roleSelectComponent = data.components.length > 1 && data.components[1].component ? data.components[1].component : null;
  const userSelectComponent = data.components.length > 2 && data.components[2].component ? data.components[2].component : null;
  if (roleSelectComponent && roleSelectComponent.values && roleSelectComponent.values.length > 0) {
    mentions += roleSelectComponent.values.map(v => `<@&${v}>`).join(' ');
  }
  if (userSelectComponent && userSelectComponent.values && userSelectComponent.values.length > 0) {
    mentions += userSelectComponent.values.map(v => `<@${v}>`).join(' ');
  }

  //create thread/task with the given name
  const endpoint = `channels/${channel.id}/threads`;
  try {
    const cretedThread = await DiscordRequest(endpoint, {
      method: 'POST', body: {
        name: taskCommand + ' ' + taskName,
        auto_archive_duration: AUTO_ARCHIVE_DURATION,
        type: 11, //Type 11 is for public threads
        rate_limit_per_user: 0
      }
    });
    //if mentions present post in thread
    const threadRes = await cretedThread.json();
    console.log('created task', taskCommand + ' ' + taskName, threadRes.id);
    console.log('which mentions:', mentions);
    if (mentions.length > 0) {
      const messageEndpoint = `channels/${threadRes.id}/messages`;
      await DiscordRequest(messageEndpoint, {
        method: 'POST', body: {
          content: `${ICON_SUCCESS} [status][created]\nAssigned to: ${mentions}\nby <@${userId}>`
        }
      });
    }
    //TODO:// Create discord event ???
  } catch (err) {
    console.error(`[error] creating thread/task [userId:${userId}, task: ${taskCommand + ' ' + taskName}] - `, err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
  return res.send(
    ephemeralTextResponese(`${ICON_SUCCESS} ${taskCommand + ' ' + taskName} 👆`)
  );
}
