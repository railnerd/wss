var http = require('http')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , ecstatic = require('ecstatic')
  , WebSocketServer = require('ws').Server;


function WSS(port, path, validMethods) {
    var self = this;
    EventEmitter.call(self);
    self.httpserver = http.createServer(ecstatic({root : path, autoIndex : true })).listen(port);
    self.wss = new WebSocketServer({server : self.httpserver});
    self.validMethods = validMethods;
    
    self.wss.on('connection', function (ws) {
        self.emit('connection',ws);
        
        ws.on('close', function() {
            self.emit('close',ws);
        });
        
        ws.on('message', function(message) {
            try {
                var jsonFromClient, methodKey;
                
                jsonFromClient = JSON.parse(message);
                for (methodKey in jsonFromClient) {
                    if (jsonFromClient.hasOwnProperty(methodKey)) {
                        if (self.validMethods && !self.validMethods[methodKey]) {
                            throw ("Unknown Method: '" + methodKey +"'");
                        } else {
                            self.emit(methodKey,ws,jsonFromClient[methodKey]);
                        }
                    }                
                }
            } catch (err) {
                ws.send(JSON.stringify({'error' : {'err': err.toString(), 'message': message}}));
            }
        });
    });
}
util.inherits(WSS, EventEmitter);


WSS.prototype.sendAll = function(msg) {
    var i, self = this;

    for (i in self.wss.clients) {
        if (self.wss.clients.hasOwnProperty(i)) {
            self.wss.clients[i].send(msg);
        }
    }
}


module.exports = {
    WSS : WSS
};
