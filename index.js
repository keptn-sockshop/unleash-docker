'use strict';

const fs = require("fs");
const unleash = require('unleash-server');
const axios = require('axios');
const basicAuthentication = require('./basic-auth-hook');

// demo code for enabling webhooks
/*
function onEventHook(event, eventData) {
  const { createdBy: user, data } = eventData;
  let text = '';

  const unleashUrl = 'http://unleash-server-service.unleash.YOURIP.xip.io/';
  const feature = `<${unleashUrl}/#/features/strategies/${data.name}|${
    data.name
  }>`;

  switch (event) {
    case 'feature-created':
    case 'feature-updated': {
      const verb =
        event === 'feature-created' ? 'created a new' : 'updated the';
      text = `${user} ${verb} feature ${feature}\ndescription: ${
        data.description
      }\nenabled: ${data.enabled}\nstrategies: \`${JSON.stringify(
        data.strategies,
      )}\``;
      break;
    }
    case 'feature-archived':
    case 'feature-revived': {
      const verb = event === 'feature-archived' ? 'archived' : 'revived';
      text = `${user} ${verb} the feature ${feature}`;
      break;
    }
    default: {
      console.error(`Unknown event ${event}`);
      return;
    }
  }

  axios
    .post(
      'https://webhook.site/YOURID',
      {
        username: 'Unleash',
        icon_emoji: ':unleash:', // if you added a custom emoji, otherwise you can remove this field.
        text: text,
      },
    )
    .then(res => {
      console.log(`Webhook post statusCode: ${res.status}. Text: ${text}`);
    })
    .catch(error => {
      console.error(error);
    });
}

const options = {
  eventHook: onEventHook,
  adminAuthentication: 'custom',
  secret: 'mysecret',
  preRouterHook: basicAuthentication,
};
*/

const options = {
    adminAuthentication: 'custom',
    secret: 'mysecret',
    preRouterHook: basicAuthentication,
  };

unleash.start(options).then(server => {
  console.log(`Unleash started on http://localhost:${server.app.get('port')}`);
});