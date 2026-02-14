import 'dotenv/config';

const DISCORD_URL = 'https://discord.com/api/v10/';

export async function DiscordRequest(endpoint, options, interactionToken = null, msg = '✅Done', channelId) {
  // append endpoint to root API URL
  const url = DISCORD_URL + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);

  // retry logic to handle resource rate limit errors (status 429)
  while (true) {
    // Use fetch to make requests
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'mzns-tm 0.0.1',
      },
      ...options
    });
    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      console.log(res.status, endpoint, data);
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('Retry-After')) * 1000;
        console.warn(`Rate limited by Discord API. Retrying after ${retryAfter} ms...`);
        // if interactionToken is present, send an ephemeral message to user that we are waiting due to rate limit
        if (interactionToken) {
          DiscordRequest(`channels/${channelId}/messages`, { 
            method: 'POST', 
            body: { 
              content: `⏳ Bot mora sačekati ${retryAfter / 1000} sekundi zbog limita. Slobodno nastavi dalje...`, 
              flags: 1 << 12 //SUPPRESS_NOTIFICATIONS	-	this message will not trigger push and desktop notifications
            } 
          });
        }
        await new Promise(r => setTimeout(r, retryAfter));
      } else throw new Error(JSON.stringify(data));
    }else {
      if (interactionToken) {
        await DiscordRequest(`webhooks/${process.env.APP_ID}/${interactionToken}/messages/@original`, {
          method: 'PATCH',
          body: { content: msg }
        });
      }
      return res;
    }
  }
}

export async function InstallGlobalCommands(appId, commands, count = 0) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;
  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
    // retry up to 5 times
    if (count <= 5) {
      console.log(`Retrying to install global commands... [attempt ${count + 1}]`);
      setTimeout(() => {
        InstallGlobalCommands(appId, commands, count + 1);
      }, 1000 * (count + 1));
    }
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨','🔴'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitString(str, n) {
    return str.split('').reduce((acc, char, index) => {
        if (index % n === 0) acc.push('');
        acc[acc.length - 1] += char;
        return acc;
    }, []);
}
