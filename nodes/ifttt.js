var request = require('request');

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
      request.post('https://maker.ifttt.com/trigger/' + node.config.eventName + '/with/key/' + node.key.credentials.key, {
        value1: msg.payload.value1,
        value2: msg.payload.value2,
        value3: msg.payload.value3
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          node.status({fill: 'green', shape: 'dot', text: 'Sent!'});
        } else {
          node.status({fill: 'red', shape: 'dot', text: 'Error!'});
          node.error(JSON.parse(body).errors[0].message);
        }
        setTimeout(function () {
          node.status({});
        }, 1000);
      });
    });
  }
  RED.nodes.registerType('ifttt out', IftttOutNode);
};
