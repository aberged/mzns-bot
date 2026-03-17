import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

// Command constants
export const TASK = 'task';
export const QR = 'qr';
export const TEMA = 'tema';
export const LEK = 'lek';

export const TASK_REQUEST_COMMAND = '🟡';
export const URGENT_TASK_REQUEST_COMMAND = '‼️';
export const TASK_CLOSE_COMMAND = '🟢';

// Task command choices
export const taskCommandChoices = [
  { 'name': '🟡 Request', 'value': '🟡' },
  { 'name': '🔵 Refined', 'value': '🔵' },
  { 'name': '🟠 In Production', 'value': '🟠' },
  { 'name': '🔴 Review', 'value': '🔴' },
  { 'name': '🟣 Scheduled', 'value': '🟣' },
  { 'name': '🟢 Published', 'value': '🟢' },
  { 'name': '‼️ HITNO', 'value': '‼️' }
];
// Task command tags
export const taskCommandIcons = {
  '🟡': 'request',
  '🔵': 'refined',
  '🟠': 'production',
  '🔴': 'review',
  '🟣': 'scheduled',
  '🟢': 'published',
  '‼️': 'urgent'
};

export const TEMA_ICON = '💬';

export const ICON_SUCCESS = '🚀';
export const ICON_BUG = '🐞';
export const ICON_WARNING = '⚠️';
export const ICON_INFO = 'ℹ️';


// Task command definition containing command options
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
const TASK_COMMAND = {
  name: TASK,
  description: 'Task operations',
  options: [
    {
      type: 3,
      name: 'do',
      description: ':pick an option',
      required: true,
      choices: taskCommandChoices,
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

// QR command definition
const QR_COMMAND = {
  name: QR,
  description: 'QR code',
  options: [
    {
      type: 3,
      name: 'urltext',
      description: ':url ili tekst',
      required: true,
    },
    {
      type: 4,
      name: 'width',
      description: ':width (default 600px)',
      required: false,
    },
    {
      type: 3,
      name: 'darkcolor', 
      description: ':dark color in hex (default #000000FF)', 
      required: false 
    }, 
    { 
      type: 3, 
      name: 'lightcolor', 
      description: ':light color in hex (default #FFFFFFFF)', 
      required: false,
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

// TEMA command definition
const TEMA_COMMAND = {
  name: TEMA,
  description: 'Tema',
  options: [
    {
      type: 3,
      name: 'naslov',
      description: ':naslov teme',
      required: true,
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

// TEMA command definition
const LEK_COMMAND = {
  name: LEK,
  description: 'LLM lektura',
  options: [
    {
      type: 3,
      name: 'tekst',
      description: ':tekst za lekturu',
      required: true,
    },
    {
      type: 3,
      name: 'stil',
      description: ':stilska dorada',
      required: false,
    },
    {
      type: 3,
      name: 'pismo',
      description: ':pismo',
      required: false,
      choices: [
        { 'name': 'latinica', 'value': 'latinica' },
        { 'name': 'ćirilica', 'value': 'cirilica' }
      ],
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TASK_COMMAND, QR_COMMAND, TEMA_COMMAND, LEK_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
