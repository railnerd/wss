var util = require('util');

var WSS = require('../index.js').WSS;

var srvr = new WSS(8080,__dirname+"/www");

srvr.on('connection', function (s) {
    console.log("new connection");
});

srvr.on('close', function (s) {
    console.log("connection closed");
});

srvr.on('set', function (s,params) {
    console.log("set: " + util.inspect(params));
    srvr.sendAll(JSON.stringify({'update' : params}));
});

srvr.on('get', function (s,params) {
    console.log("get: " + util.inspect(params));
    s.send(JSON.stringify({'update' : params}));
});
