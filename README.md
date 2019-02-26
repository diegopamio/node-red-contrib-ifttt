# node-red-ifttt [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status](https://coveralls.io/repos/github/diegopamio/node-red-contrib-ifttt/badge.svg?branch=master)](https://coveralls.io/github/diegopamio/node-red-contrib-ifttt?branch=master)
> A node-red node to connect to ifttt Webhooks channel (aka Maker channel)

## Why(s)?

### Why not just httprequest?

You can use a simple http request node, following the example flows shown [here](http://flows.nodered.org/flow/f8bda419efca37dc0366c47cdadf40ad), but you will have the following benefits by using the node-red-ifttt node:

1. Reuse of the key. The key can be entered in the configuration node and will be used by any ifttt node.
2. Nicer UI, where you don't have to insert (error-prone) event name and key in the middle of an URL.
3. Security: the key in the configuration module is considered a credential and so it won't be exported when exporting your flows.

### Why using IFTTT at all?

Anyone can argue that node-red is a superset of IFTTT and everything you can do with IFTTT you should be able to do it with node-red. That's true, except for the following considerations:

* There are some services that doesn't have yet a node-red implementation (e.g.: LIFX, even though there is a node-red node for it, it won't work except in the same network) which would take you a lot of work to implement, compared with 0 effort on the other hand.
* Unified credentials, easy to setup at once and forever for all the recipes and all the IFTTT chanels.

## Installation

```sh
$ npm install node-red-contrib-ifttt
```

## Usage

The module has three node definitions:

* The Configuration node, which serves to the purpose of setting the IFTTT channel key.
* The Output node, which will trigger an event with the msg.payload data.
* (comming soon) The Input node, which will be triggered by IFTTT when a recipe is hit.

## License

MIT © [Diego Pamio](http://github.com/diegopamio)


[npm-image]: https://badge.fury.io/js/node-red-contrib-ifttt.svg
[npm-url]: https://npmjs.org/package/node-red-contrib-ifttt
[travis-image]: https://travis-ci.org/diegopamio/node-red-contrib-ifttt.svg?branch=master
[travis-url]: https://travis-ci.org/diegopamio/node-red-contrib-ifttt
[daviddm-image]: https://david-dm.org/diegopamio/node-red-contrib-ifttt.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/diegopamio/node-red-contrib-ifttt
[coveralls-image]: https://coveralls.io/repos/diegopamio/node-red-contrib-ifttt/badge.svg
