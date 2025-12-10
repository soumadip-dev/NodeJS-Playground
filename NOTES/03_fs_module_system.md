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