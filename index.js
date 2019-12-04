const unleash = require('unleash-server');
const axios = require('axios');
const basicAuthentication = require('./basic-auth-hook');

function onEventHook(event, eventData) {
  const { createdBy: user, data } = eventData;
  let text = '';

  const unleashUrl = 'http://YOUR_UNLEASH_IP';
  const feature = `<${unleashUrl}/#/features/strategies/${data.name}|${
    data.name
  }>`;

  switch (event) {
    //case 'feature-created':
    case 'feature-updated': {

      payload = {
        "eventType": "CUSTOM_CONFIGURATION",
        "attachRules": {
          "tagRule": [
            {
              "meTypes": [
                "SERVICE"
              ],
              "tags": [
                {
                  "context": "CONTEXTLESS",
                  "key": "service",
                  "value": `${data.description}`
                },
              ]
            }
          ]
        },
        "source": "Unleash via Keptn",
        "description": `Feature toggle ${data.name} set to value: ${data.enabled}`,
        "configuration": `${data.name}`,
        "customProperties": {
          "UnleashServer": `${unleashUrl}/#/features/strategies/${data.name}`
        }
      };
      break;
    }
    // case 'feature-archived':
    // case 'feature-revived': {
    //   const verb = event === 'feature-archived' ? 'archived' : 'revived';
    //   text = `${user} ${verb} the feature ${feature}`;
    //   break;
    // }
    default: {
      console.error(`Unknown event ${event}`);
      return;
    }
  }

  axios
    .post(
      'https://DT_TENANT/api/v1/events',
      payload,
      { headers : { 'Authorization': 'Api-Token DT_API_TOKEN', 'Content-Type': 'application/json'} }
    )
    .then(res => {
      console.log(`Webhook post statusCode: ${res.status}. Text: ${text}`);
    })
    .catch(error => {
      console.error(error);
    });
}

const options = {
  // eventHook: onEventHook,
  adminAuthentication: 'custom',
  secret: 'mysecret',
  preRouterHook: basicAuthentication,
};

unleash.start(options).then(server => {
  console.log(`Unleash started on http://localhost:${server.app.get('port')}`);
});