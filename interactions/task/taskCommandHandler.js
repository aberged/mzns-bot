import { InteractionResponseType } from 'discord-interactions';
import { ICON_BUG, ICON_INFO, ICON_SUCCESS, ICON_WARNING, TASK_CLOSE_COMMAND, TASK_REQUEST_COMMAND, taskCommandIcons, TEMA_ICON } from '../../commands.js';
import { ephemeralTextResponese, requestTaskModal, simpleTextResponese } from '../../responses.js';
import { DiscordRequest } from '../../utils.js';

export async function taskCommandHandler(req, res) {
  // Interaction data and channel
  const { data, channel } = req.body;

  // User's object choice
  const taskCommand = data.options[0].value;
  // Interaction context
  const context = req.body.context;
  // User ID is in user field for (G)DMs, and member for servers
  const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
  console.log('task command:', taskCommand, context, userId);

  // Check if it's NOT a thread channel
  if (!channel.thread_metadata) {
    // Send a modal as response if the choice is "Request"
    if (taskCommand === TASK_REQUEST_COMMAND) {
      return res.send(
        requestTaskModal(taskCommand)
      );
    }
    // For other choices, inform user that status can be changed only in threads
    return res.send(
      ephemeralTextResponese(`${ICON_WARNING} Status taskova se može menjati samo u tredovima(taskovima), ne i kanalima (kanali su skupovi tredova, tredovi su taskovi)! \n${ICON_INFO} Ako želiš da kreiraš novi task probaj \`/task do 🟡 Request\``)
    );
  }
  // No task requests inside threads/tasks
  if (taskCommand === TASK_REQUEST_COMMAND) {
    return res.send(
      ephemeralTextResponese(`${ICON_WARNING} Kreiranje novih taskova nije moguće u tredovima, samo u kanalima (kanali su skupovi tredova, tredovi su taskovi)!\n${ICON_INFO} Ako želiš da kreiraš novi task probaj \`/task do 🟡 Request\` u <#${channel.parent_id}> ili nekom drugom kanalu.`)
    );
  }
  // no task operations inside tema threads
  if (channel.name.startsWith(TEMA_ICON)) {
    return res.send(
      ephemeralTextResponese(`${ICON_WARNING} Menjanje statusa taskova nije moguće unutar tema.`)
    );
  }

  // For other choices inside threads, just update the channel name with provided status
  const taskName = channel.name.split(' ').slice(1).join(' ') || 'No name task';
  console.log('updateing task:', taskName, channel.id);

  const endpoint = `channels/${channel.id}`;
  try {
    DiscordRequest(endpoint, { method: 'PATCH', body: { name: taskCommand + ' ' + taskName } }, 
      req.body.token,
      `${ICON_SUCCESS} [status][${taskCommandIcons[taskCommand] || 'unknown'}] ${taskCommand}`,
      channel.id
    );
  } catch (err) {
    console.error('Error updating channel name:', err);
    return res.send(
      ephemeralTextResponese(`${ICON_BUG} [error] Pošlo po zlu: ${err.message || err}`)
    );
  }
  // close task command?
  if (taskCommand === TASK_CLOSE_COMMAND) {
    // archive thread after 1 second to avoid weird error
    setTimeout(() => {
      DiscordRequest(endpoint, { method: 'PATCH', body: { archived: true } });
    }, 1000);
  }
  return res.send(
    simpleTextResponese(`${ICON_SUCCESS} [status][${taskCommandIcons[taskCommand] || 'unknown'}] ${taskCommand}`, InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE)
  );
}
