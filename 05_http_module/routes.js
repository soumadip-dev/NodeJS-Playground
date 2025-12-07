const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (url === '/project') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Project page');
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Something Went wrong');
  }
});

const port = 8080;

server.listen(port, (req, res) => {
  console.log(`Server is now listening on port ${port}`);
});
