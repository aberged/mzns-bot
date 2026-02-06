import { InteractionResponseType, MessageComponentTypes } from "discord-interactions";

export function simpleTextResponese(content, type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE) {
  return {
    type: type,
    data: { content: content },
  };
}

export function ephemeralTextResponese(content, type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE) {
  return {
    type: type,
    data: { flags: 1 << 6, content: content },
  };
}

export function componentsResponese(data, type = InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE) {
  return {
    type: type,
    data: data,
  };
}

export const TASK_MODAL_PREFIX = 'task_command_';

export function requestTaskModal(taskCommand) {
  return {
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: TASK_MODAL_PREFIX + taskCommand,
      title: 'New Task',
      components: [
        {
          // Text input must be inside of an action component
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              // See https://discord.com/developers/docs/components/reference#text-input
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: 'task_name_input',
              style: 1,
              label: 'Task name',
            }
          ],
        },
        {
          // Role select must be inside of an label component
          type: 18, // https://discord.com/developers/docs/components/reference#label
          label: 'Assign role/s (optional)',
          component: {
            type: MessageComponentTypes.ROLE_SELECT,
            custom_id: 'my_role_select',
            label: 'Assign role(s)',
            min_values: 0,
            max_values: 10,
            required: false,
          }
        },
        {
          // Text input must be inside of an action component
          type: 18,
          label: 'Assign user/s (optional)',
          component: {
            type: MessageComponentTypes.USER_SELECT,
            custom_id: 'my_user_select',
            label: 'Assign user(s)',
            min_values: 0,
            max_values: 10,
            required: false,
          }
        }
      ]
    }
  }
}