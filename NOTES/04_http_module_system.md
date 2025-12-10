### `http` Module

The `http` module is a core Node.js module used to create HTTP servers and handle client–server communication.

It allows Node.js to listen for incoming requests, process them, and send appropriate responses based on the request URL and method.

#### Key Concepts

- `http.createServer()` → Creates an HTTP server.
- `req` (Request Object) → Contains information about the incoming request, such as the URL and headers.
- `res` (Response Object) → Used to send data back to the client.
- `res.writeHead()` → Sets the HTTP status code and response headers.
- `res.end()` → Ends the response and sends data to the client.
- `server.listen()` → Starts the server and listens on a specified port.

#### Basic Request Handling

A server can handle different routes by checking `req.url` and sending responses accordingly:

- `/` → Handles the home page request.
- `/project` → Handles the project page request.
- Any other route → Returns an error response.

#### Example

```js
const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (url === '/project') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Project Page');
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
});

const port = 8080;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
```
