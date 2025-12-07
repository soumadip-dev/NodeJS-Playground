const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  res.end('Hello from course backend');
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
