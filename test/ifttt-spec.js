var sinon = require('sinon');
var mockery = require('mockery');
var helper = require('./helper');
var nock = helper.nock;

describe('ifttt nodes', function () {
  var clock;
  var requestStub;
  mockery.enable();
  var iftttNode;

  before(function (done) {
    requestStub = {
      post: sinon.stub()
    };
    mockery.registerMock('request', requestStub);
    clock = sinon.useFakeTimers();
    iftttNode = require('../nodes/ifttt');
    helper.startServer(done);
  });

  afterEach(function () {
    if (nock) {
      nock.cleanAll();
    }
    helper.unload();
    mockery.deregisterAll();
    mockery.disable();
  });

  after(function () {
    clock.restore();
  });

  describe('node-red-contrib-ifttt', function () {
    it('should register a new node-red node', function (done) {
      var flow = [{id: 'node1', type: 'ifttt out', name: 'ifttt', wires: [[]]}];
      helper.load(iftttNode, flow, function () {
        var n1 = helper.getNode('node1');
        n1.should.have.property('name', 'ifttt');
        done();
      });
    });
    it('should send http request to the IFTTT service', function (done) {
      var flow = [
        {id: 'node1', type: 'ifttt out', name: 'ifttt', wires: [[]], key: 'node2', eventName: 'event1'},
        {id: 'node2', type: 'ifttt-key', wires: [[]]}
      ];
      var credentials = {
        node2: {
          key: 'some-key'
        }
      };
      helper.load(iftttNode, flow, credentials, function () {
        var n1 = helper.getNode('node1');
        var values = {
          value1: 'val1',
          value2: 'val2',
          value3: 'val3'
        };

        var stubStatus = sinon.stub(n1, 'status');

        n1.emit('input', {payload: values});
        requestStub.post.called.should.be.equal(true);
        requestStub.post.getCall(0).args[0].should.be.equal('https://maker.ifttt.com/trigger/event1/with/key/some-key');
        requestStub.post.getCall(0).args[1].should.be.deepEqual(values);
        var cb = requestStub.post.getCall(0).args[2];
        cb(undefined, {statusCode: 200}, '{}');
        stubStatus.called.should.be.equal(true);
        stubStatus.getCall(0).args[0].should.be.deepEqual({fill: 'blue', shape: 'dot', text: 'Sending...'});
        clock.tick(1000);
        stubStatus.getCall(1).args[0].should.deepEqual({fill: 'green', shape: 'dot', text: 'Sent!'});
        done();
      });
    });
    it('should raise an error if the request returns !== 200', function (done) {
      var flow = [
        {id: 'node1', type: 'ifttt out', name: 'ifttt', wires: [[]], key: 'node2', eventName: 'event1'},
        {id: 'node2', type: 'ifttt-key', wires: [[]]}
      ];
      var credentials = {
        node2: {
          key: 'some-key'
        }
      };
      helper.load(iftttNode, flow, credentials, function () {
        var n1 = helper.getNode('node1');
        var values = {
          value1: 'val1',
          value2: 'val2',
          value3: 'val3'
        };

        n1.emit('input', {payload: values});
        requestStub.post.called.should.be.equal(true);
        requestStub.post.getCall(0).args[0].should.be.equal('https://maker.ifttt.com/trigger/event1/with/key/some-key');
        requestStub.post.getCall(0).args[1].should.be.deepEqual(values);
        var cb = requestStub.post.getCall(0).args[2];
        cb(undefined, {statusCode: 500}, '{"errors": [{"message": "fake error"}]}');
        done();
      });
    });
  });
});
