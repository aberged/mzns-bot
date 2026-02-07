# MZNS-BOT

## *[Discord](https://support.discord.com/hc/en-us/articles/360045138571-Beginner-s-Guide-to-Discord) task management bot*

- **mzns-bot** koristi [Discord kanale](https://discord.com/developers/docs/resources/channel) kao kontejnere za taskove.
- Taskovi su zapravo [Discord tredovi](https://discord.com/developers/docs/resources/channel#start-thread-without-messagehttps://discord.com/developers/docs/resources/channel#start-thread-without-message), "kanali u kanalima",  sa ikonicama kao statusima u nazivu.
- Svaki kontejner taskova, tj kanal, pripada nekom [domenu/kategoriji](https://discord.com/developers/docs/resources/channel#channel-object-channel-types).<br>

Primer:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-02%20205114.png)
`DATA` je kategorija/domen, 
`# arhiva-foto-video` je kanal,
`🔵Task1` je task/tred sa statusom `🔵 Refined`

Koristi se pozivanjem bota: `/task [komanda]` gde komanda može biti:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-01-31%20201429.png)<br>

- **🟡 Request** - Kreira novi task ako se pokrene iz kanala, a postavlja status taska ako se pokrene iz taska. <br>
Prilikom kreiranja novog taska potrebno je popuniti [dijalog](https://discord.com/developers/docs/components/using-modal-components) nazivom taska i (po potrebi) *rolama* i/ili *korisnicima* koje je porebno obavestiti.<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-01-31%20202736.png)<br>
Klikom na "Submit" bot će kreirati task i u njemu takogavti odabrane *role* i/ili *korisnike* (ukoliko su odabrani u prethodnom koraku) i ostaviti ***info log*** poruku o kreiranom tasku.<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-01-31%20232017.png)<br>
- **🔵 Refined** - Postavlja status taska i ostavlja ***info log*** poruku o promenjenom statusu.<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-01-31%20232721.png)<br>
- **🟠 In Production** - Postavlja status taska  i ostavlja ***info log*** poruku o promenjenom statusu.<br>
- **🔴 Review** - Postavlja status taska i ostavlja ***info log*** poruku o promenjenom statusu.<br>
- **🟣 Scheduled** - Postavlja status taska i ostavlja ***info log*** poruku o promenjenom statusu.<br>
- **🟢 Published** - Postavlja status taska i ostavlja ***info log*** poruku o promenjenom statusu.<br>

-----------------------------------------

### Navigacija kroz sadržaj poruka, kanala i taskova

<details>
  <summary>
    Putem pretrage
  </summary>


<br>Pretraga je izvodljiva po različitim kriterijumima: **`from:`, `in:`, `has:`, `mentions:`, `pinned:`, `before:`, `during:`, `after:`** :<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20214105.png)<br>

**Kombinavanjem tih kriterijuma Discord može imati ulogu browsera ili galerije sadržaja koji tražimo.**

U sličaju `has: image` može poslužiti kao galerija fotigrafija sa svih kanala iz svih kategorija:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20215611.png)<br>

U sličaju `has: poll` može poslužiti kao pregled glasanja sa svih kanala iz svih kategorija :<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20215406.png)<br>

U sličaju `has: image` `in: arhiva-foto-video` može poslužiti kao galerija samo iz kanala `#arhiva-foto-video`:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20220130.png)<br>

Za još detaljniju pretragu postoji Filters dugme koje otvara dijalog sa svim opcijama za pretragu:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20220901.png)<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20220552.png)<br>

**Info log** olakšava tekstualnu pretragu koja daje hronološki niz promene statusa taskova. Npr:<br>
![](https://storage.googleapis.com/frbs/Screenshot%202026-02-01%20002254.png)<br>

</details>
<details>
  <summary>Putem tagovanja/referenciranja/liknovanja</summary>

<br>**Message Forwarding**
Forwardovana poruka ima link ka izvornom kanalu
<br>**Channel tagging**
<br>**Event links**
</details>

--------------------
#### 👇tech intro from [discord starter app repository](https://github.com/discord/discord-example-app)
<details>
  <summary>Getting Started app for Discord</summary>
  # Getting Started app for Discord

This project contains a basic rock-paper-scissors-style Discord app written in JavaScript, built for the [getting started guide](https://discord.com/developers/docs/getting-started).

![Demo of app](https://github.com/discord/discord-example-app/raw/main/assets/getting-started-demo.gif?raw=true)

## Project structure

Below is a basic overview of the project structure:

```
├── examples    -> short, feature-specific sample apps
│   ├── app.js  -> finished app.js code
│   ├── button.js
│   ├── command.js
│   ├── modal.js
│   ├── selectMenu.js
├── .env.sample -> sample .env file
├── app.js      -> main entrypoint for app
├── commands.js -> slash command payloads + helpers
├── game.js     -> logic specific to RPS
├── utils.js    -> utility functions and enums
├── package.json
├── README.md
└── .gitignore
```

## Running app locally

Before you start, you'll need to install [NodeJS](https://nodejs.org/en/download/) and [create a Discord app](https://discord.com/developers/applications) with the proper permissions:

- `applications.commands`
- `bot` (with Send Messages enabled)

Configuring the app is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

### Setup project

First clone the project:

```
git clone https://github.com/discord/discord-example-app.git
```

Then navigate to its directory and install dependencies:

```
cd discord-example-app
npm install
```

### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `.env.sample` for an example). You'll need your app ID (`APP_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).

### Install slash commands

The commands for the example app are set up in `commands.js`. All of the commands in the `ALL_COMMANDS` array at the bottom of `commands.js` will be installed when you run the `register` command configured in `package.json`:

```
npm run register
```

### Run the app

After your credentials are added, go ahead and run the app:

```
node app.js
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.

If you aren't following the [getting started guide](https://discord.com/developers/docs/getting-started), you can move the contents of `examples/app.js` (the finished `app.js` file) to the top-level `app.js`.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀

## Other resources

- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.


deploy to gcloud run - `gcloud run deploy --source .`

</details>

--------------------
