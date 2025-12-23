const fs = require('fs');

console.log(1);

// Non-blocking file read
fs.readFile('contacts.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error('File read error:', error.message);
    return;
  }
  console.log(data);
});

// setTimeout callback
setTimeout(() => {
  console.log('Message from setTimeout ⏱️');
}, 5000);

// setImmediate callback
setImmediate(() => {
  console.log('Message from setImmediate');
});

// process.nextTick callback
process.nextTick(() => {
  console.log('Message from process.nextTick');
});

// Promise example
const examplePromise = new Promise(resolve => {
  resolve('Promise resolved');
});

examplePromise.then(message => {
  console.log('Message from promise:', message);
});

console.log(2);
