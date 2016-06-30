var request = require('request');
var querystring = require('querystring');

module.exports = function(RED) {
  // This is a config node holding the keys for connecting to PubNub
  function IftttKeyNode(n) {
    RED.nodes.createNode(this,n);
    this.key = n.key;
  }

  RED.nodes.registerType("ifttt-key",IftttKeyNode);

  // This is the output node.
  function IftttOutNode(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    node.config = config;
    node.key = RED.nodes.getNode(config.key.key);
    this.on('input', function(msg) {
      node.status({fill:"blue",shape:"dot",text:"Sending..."});
      request.post('https://maker.ifttt.com/trigger/' + node.config.eventName + '/with/key/' + node.key, {
        value1: msg.payload.value1,
        value2: msg.payload.value2,
        value3: msg.payload.value3
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          node.status({fill:"green",shape:"dot",text:"Sent!"});
          setTimeout(function () {
            node.status();
          }, 1000);
          // msg.payload = response;
          // node.send(msg);
        } else {
          node.error('IFTTT');
        }
      });
    });
  }
  RED.nodes.registerType("ifttt",IftttOutNode);

  
};
