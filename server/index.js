var WebSocketServer = require('websocket').server;
var http = require('http');

var connections = {};

var server = http.createServer(function (request, response) {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log(new Date() + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.'
    );
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);

  connections[request.resourceURL.query.id] = connection;
  console.log(new Date() + ' Connection ID ' + connection.id + ' accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      broadcast(JSON.parse(message.utf8Data));
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log(
      new Date() +
        ' Peer ' +
        connection.remoteAddress +
        ' disconnected. ' +
        'Connection ID: ' +
        connection.id
    );

    // Make sure to remove closed connections from the global pool
    delete connections[connection.id];
  });
});

// Broadcast to all open connections
function broadcast(data) {
  Object.keys(connections).forEach(function (key) {
    var connection = connections[key];
    if (connection.connected && +data.playerId !== +key) {
      connection.sendUTF(JSON.stringify(data));
    }
  });
}
