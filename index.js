require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/tyo-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/tyo-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/tyo-ping - Check bot latency
/tyo-help - Show available commands
/tyo-joke - Get a random joke
/tyo-dad-joke - Get a random dad joke
/tyo-feedback - Send feedback to the bot developer
/tyo-echo - Echo back your message
`  });
});

app.command("/tyo-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "The jokes are running late at the moment" });
  }
});

app.command("/tyo-dad-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://icanhazdadjoke.com", {
      headers: {
        Accept: "application/json"
      }
    });
    await respond({
      text:
`${response.data.joke}`
    });
  } catch (err) {
    await respond({ text: "The dad jokes are currently unavailable." });
  }
});


app.command("/tyo-feedback", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: "Your feedback: " + command.text + "\nThank you for your feedback! It has been sent to the bot developer." });
  console.log("New feedback received: " + command.text);
});
app.command("/tyo-echo", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: command.text });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();