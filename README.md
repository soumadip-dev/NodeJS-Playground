# Node.js Full Course

A comprehensive learning repository for mastering Node.js, from fundamentals to advanced concepts.

## About

This repository documents my journey of learning Node.js, including examples, exercises, and projects that cover the core Node.js ecosystem.

---

## Note

### Node.js Module System

The Node.js module system allows you to organize code into multiple reusable pieces. Each file in Node.js is treated as a module.

- `module.exports` → Used to export functionality.
- `require` → Used to import functionality.

### Module Wrapper

In Node.js, every module is wrapped inside a function (IIFE) before execution. This wrapper function is called the **module wrapper function**. It provides access to the following parameters:

- `exports`: An initially empty object `{}` whose purpose is to collect values (functions, objects, etc.) that we want to make available to other modules.
- `require`: A function used to load other modules.
- `module`: An object that represents the current module.
- `__filename`: A string containing the full absolute path of the current module file.
- `__dirname`: A string containing the directory name of the current module.

```js
(function (exports, require, module, __filename, __dirname) {
  // Actual module code goes here
});
```

---

### Path Module

The `path` module provides utilities for working with file and directory paths.

- `path.dirname` → Returns the directory name of the given file path.
- `path.basename` → Returns the name of the given file (with extension).
- `path.extname` → Returns the extension of the given file.
- `path.join` → Joins multiple path segments into a single path using the correct separator.
- `path.resolve` → Resolves the given path segments into a single absolute path.
- `path.normalize` → Normalizes a path by resolving `..`, `.`, and removing redundant separators.

---

### `fs` Module

The `fs` (File System) module allows Node.js to interact with the file system. It provides both **synchronous** and **asynchronous** methods to perform operations such as creating, reading, updating, and deleting files.

#### Synchronous vs Asynchronous

There are two types of methods in the `fs` module:

- **Synchronous (`Sync`) methods** block execution until the operation is completed.
- **Asynchronous methods** use callbacks to handle completion, enabling non-blocking code execution.

#### Common Methods

- **Creating & Writing Files**

```js
fs.writeFileSync(filePath, 'Content'); // Synchronous
fs.writeFile(filePath, 'Content', callback); // Asynchronous
```

- **Reading Files**

```js
const data = fs.readFileSync(filePath, 'utf-8'); // Synchronous
fs.readFile(filePath, 'utf-8', (err, data) => {}); // Asynchronous
```

- **Appending Data to Files**

```js
fs.appendFileSync(filePath, 'New line'); // Synchronous
fs.appendFile(filePath, 'New line', callback); // Asynchronous
```

- **Checking & Creating Directories**

```js
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath); // Synchronous
```

---

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
