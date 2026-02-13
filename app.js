import 'dotenv/config';
import express from 'express';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { taskRequestModalHandler } from './interactions/task/taskRequestModalHandler.js';
import { taskCommandHandler } from './interactions/task/taskCommandHandler.js';
import { qr } from './interactions/qr/qr.js';
import { LEK, QR, TASK, TEMA } from './commands.js';
import { TASK_MODAL_PREFIX } from './responses.js';
import { tema } from './interactions/tema/tema.js';
import { handleWelcomeRoleSelection, welcome, WELCOME_ROLE_SELECT_ID } from './welcome/welcome.js';
import { lek } from './interactions/lek/lek.js';

// Create an express app
const app = express();
// Get port, or default to 8080
const PORT = process.env.PORT || 8080;

// Create a new discord.js client instance
export const client = new Client({ intents: [
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
]});
// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient) => {
	console.log(`discord.js client is ready! Logged in as ${readyClient.user.tag}`);
  welcome();
});
// Log in to Discord with client's token
client.login(process.env.DISCORD_TOKEN);

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type, data, channel and member/user info
  const { type, data } = req.body;

  console.log('Received interaction:', type || 'unknown type', data && data.name? data.name : 'no name');

  /**
  * Handle request types
  */
  switch (type) {
    /**
    * Handle verification requests, PINGs
    */
    case InteractionType.PING:
      return res.send({ type: InteractionResponseType.PONG });
    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    case InteractionType.APPLICATION_COMMAND:
      switch (data.name) {
        case TASK:
          return taskCommandHandler(req, res);
        case QR:
          return qr(req, res);
        case TEMA:
          return tema(req, res);
        case LEK:
          return lek(req, res);
      }
      break;
    /**
     * Handle component interactions
     */
    case InteractionType.MESSAGE_COMPONENT:
      console.log('Received message component interaction with customId:', data.custom_id);
      if (data && data.custom_id.startsWith(WELCOME_ROLE_SELECT_ID)) {
        return handleWelcomeRoleSelection(req, res);
      }

      return res.status(400).json({ error: 'Unknown message component interaction' });
    /**
     * Handle modal submissions
     */
    case InteractionType.MODAL_SUBMIT:
      const modalId = data.custom_id;
      if (modalId && modalId.startsWith(TASK_MODAL_PREFIX)) {
        return taskRequestModalHandler(req, res);
      }
      break;
  }

  // if we reach here, unknown type msg
  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('mzns listening on port', PORT);
});
