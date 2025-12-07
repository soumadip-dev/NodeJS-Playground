const fs = require('fs');
const path = require('path');

const dataFolderPath = path.join(__dirname, 'data');

// =========================
// Synchronous way
// =========================

if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath);
  console.log('Data folder created');
}

const syncFilePath = path.join(dataFolderPath, 'sync-example.txt');

fs.writeFileSync(syncFilePath, 'Hello from Node.js');

const syncFileContent = fs.readFileSync(syncFilePath, 'utf-8');
console.log(syncFileContent);

fs.appendFileSync(syncFilePath, '\nThis is a new line added to the file');

// =========================
// Asynchronous way
// =========================

const asyncFilePath = path.join(dataFolderPath, 'async-example.txt');

fs.writeFile(asyncFilePath, 'Hello from async Node.js', writeError => {
  if (writeError) throw writeError;
  console.log('Async file created successfully');
});

fs.readFile(asyncFilePath, 'utf-8', (readError, fileContent) => {
  if (readError) throw readError;
  console.log(fileContent);
});

fs.appendFile(asyncFilePath, '\nThis is a new line added to the async file', appendError => {
  if (appendError) throw appendError;
  console.log('New line added to async file');

  fs.readFile(asyncFilePath, 'utf-8', (finalReadError, updatedContent) => {
    if (finalReadError) throw finalReadError;
    console.log('Updated file content:', updatedContent);
  });
});
