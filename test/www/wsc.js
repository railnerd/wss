var ws = new WebSocket("ws://" + window.location.host);

ws.onopen = function () {
    console.log("connected");
//  ws.send(JSON.stringify({"set":[{"NT100" : "N"}]}));
};

ws.onclose = function () {
    console.log("disconnected");
};

ws.onmessage = function (msg) {
    console.log("server message: " + msg.data);
    var serverMessage = JSON.parse(msg.data);
    for (var methodKey in serverMessage) {
        if (serverMessage.hasOwnProperty(methodKey)) {
            if (methodHandlers[methodKey] !== undefined) {
                methodHandlers[methodKey](ws,serverMessage[methodKey]);
            } else {
                console.log("UNKNOWN METHOD: ", methodKey);
            }
        }
    }
}

var methodHandlers = {
    'update' : doUpdate,
    'error'  : doError
}

function doUpdate(ws,params) {
    console.log("doUpdate: "+ JSON.stringify(params));
//  ws.send(JSON.stringify({"hi":[{"NT100" : "N"}]}));
//  ws.send("fnorp");
}

function doError(ws,params) {
    console.log("doError: "+ JSON.stringify(params));
}