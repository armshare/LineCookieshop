'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const configuration = require('./config.json');
const crypto = require('crypto');
// create LINE SDK config from env variables
// console.log('config ', configuration.ChannelSecret);
const config = {
    channelAccessToken: configuration.LineAccessToken,
    channelSecret: configuration.ChannelSecret,
  };

// // create LINE SDK client
const client = new line.Client(config);

// create Express app
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc line.middleware(config),
app.post('/callback',  (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/callback',  (req, res) => {
    console.log('callback ', req);
    // Promise
    //   .all(req.body.events.map(handleEvent))
    //   .then((result) => res.json(result))
    //   .catch((err) => {
    //     console.error(err);
    //     res.status(500).end();
    //   });
  });
// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});