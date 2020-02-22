const unleash = require('unleash-server');
const axios = require('axios');
const basicAuthentication = require('./basic-auth-hook');

function onEventHook(event, eventData) {
  const { createdBy: user, data } = eventData;
  let text = '';

  // const unleashUrl = 'http://unleash.unleash-production.35.224.9.95.xip.io';
  // const feature = `<${unleashUrl}/#/features/strategies/${data.name}|${
  //   data.name
  // }>`;

  switch (event) {
    //case 'feature-created':
    case 'feature-updated': {

      dt_payload = {
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
                  "key": "keptn_service",
                  "value": `${data.description}`
                },
                {
                  "context": "CONTEXTLESS",
                  "key": "keptn_stage",
                  "value": "production"
                }
              ]
            }
          ]
        },
        "source": "Unleash via Keptn",
        "description": `Feature toggle ${data.name} set to value: ${data.enabled}`,
        "configuration": `${data.name}`,
        // "customProperties": {
        //   "UnleashServer": `${unleashUrl}/#/features/strategies/${data.name}`
        // }
      };
      keptn_payload = {
        "contenttype": "application/json",
        "data": {
          "canary": {
            "action": "Feature toggle: ",
            "value": `${data.name} set to value: ${data.enabled}`
          },
          "eventContext": null,
          "labels": null,
          "project": "sockshop",
          "service": `${data.description}`,
          "stage": "production",
          
        },
        "source": "Unleash",
        "specversion": "0.2",
        "type": "sh.keptn.event.configuration.change",
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
      'https://'+process.env.DT_TENANT+'/api/v1/events',
      dt_payload,
      { headers : { 'Authorization': 'Api-Token '+process.env.DT_API_TOKEN, 'Content-Type': 'application/json'} }
    )
    .then(res => {
      console.log(`Webhook post statusCode: ${res.status}. Text: ${text}`);
    })
    .catch(error => {
      console.error(error);
    });

  axios
    .post(
      'http://api.keptn/v1/event',
      keptn_payload,
      { headers : { 'x-token': process.env.KEPTN_TOKEN, 'Content-Type': 'application/json'} }
    )
    .then(res => {
      console.log(`Keptn post statusCode: ${res.status}. Text: ${text}`);
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

unleash.start(options).then(server => {
  console.log(`Unleash started on http://localhost:${server.app.get('port')}`);
});