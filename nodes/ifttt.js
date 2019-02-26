var request = require('request');
var IFTTT_CONNECTION_TIMEOUT_MS = 20000;

module.exports = function (RED) {
  // This is a config node holding the keys for connecting to PubNub
  function IftttKeyNode(n) {
    RED.nodes.createNode(this, n);
  }

  RED.nodes.registerType('ifttt-key', IftttKeyNode, {credentials: {key: {type: 'text'}}});

  // This is the output node.
  function IftttOutNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.config = config;
    node.key = RED.nodes.getNode(config.key);
    this.on('input', function (msg) {
      node.status({fill: 'blue', shape: 'dot', text: 'Sending...'});
      var iftttPayload = {};
      if (msg.payload) {
        iftttPayload.value1 = msg.payload.value1;
        iftttPayload.value2 = msg.payload.value2;
        iftttPayload.value3 = msg.payload.value3;
      }
      var eventName = msg.payload.eventName ? msg.payload.eventName : node.config.eventName;
      request({
        uri: 'https://maker.ifttt.com/trigger/' + eventName + '/with/key/' + node.key.credentials.key,
        method: 'POST',
        timeout: IFTTT_CONNECTION_TIMEOUT_MS,
        json: iftttPayload
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          node.status({fill: 'green', shape: 'dot', text: 'Sent!'});
        } else {
          var errorMessage;
          try {
            errorMessage = (JSON.parse(body).hasOwnProperty('errors')) ? JSON.parse(body).errors[0].message : JSON.parse(body);
          } catch (e) {
            node.error("IFTTT Read error");
            errorMessage = e;
          }
          node.status({fill: 'red', shape: 'dot', text: 'Error!'});
          node.error(errorMessage);
        }
        setTimeout(function () {
          node.status({});
        }, 1000);
      });
    });
  }
  RED.nodes.registerType('ifttt out', IftttOutNode);
};
