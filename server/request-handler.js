/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var url = require('url');
storage = {};
storage.results = [];
var currentId = 1;
console.log('this is the url ' + url);
var createRoom = function(roomName) {
  if(storage[roomName] === undefined) {
    storage[roomName] = {results: []};
  } 
}
exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  //information for headers
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  response.writeHead(statusCode, headers);

  //message storage
  // var storage = {};
  var fullText = '';
  //respond to an OPTIONS request to any URL
  if (request.method === 'OPTIONS') {
    console.log('Responding with ' + statusCode)
    response.end('ok');
  }
  var parsedUrl = url.parse(request.url);
  //checks URL
  if(parsedUrl.pathname.substring(0,9) === '/classes/') {
    var room = parsedUrl.pathname.substring(9);
    if(storage[room] === undefined) {
      createRoom(room);
    }
    var roomContents = storage[room];


  //respond to a get request
    if(request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(roomContents));
      //respond to a POST request
    } else if (request.method === 'POST') {
      //accepts data and concats to variable
      request.on('data', function(chunk) {
        fullText += chunk.toString();
      });
      //sends response when all  data is received and pushes data to storage
      request.on('end', function() {
        response.writeHead(201, headers);
        roomContents.results.unshift(JSON.parse(fullText));
        roomContents.results[roomContents.results.length - 1].objectId = currentId;
        currentId++;
        response.end();
      });
    }
    //responds to illegal requests
  } else {
    response.writeHead(404);
    response.end('404 file not found');
  }



  /* Without this line, this server wouldn't work. See the note

   * below about CORS. */

  /* .writeHead() tells our server what HTTP status code to send back */

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  //response.end(storage[0]);
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};
