// Allocate a buffer of 10 bytes
const allocatedBuffer = Buffer.alloc(10);
console.log(allocatedBuffer, 'Allocated buffer');

// Create a buffer from a string
const bufferFromString = Buffer.from('Hello');
console.log(bufferFromString, 'Buffer from string');

// Create a buffer from an array of integers
const bufferFromNumberArray = Buffer.from([1, 2, 3, 4, 5]);
console.log(bufferFromNumberArray, 'Buffer from number array');

// Write data into the allocated buffer
allocatedBuffer.write('Node JS');
console.log('After writing "Node JS" to allocatedBuffer:', allocatedBuffer.toString());

// Access a specific byte from the buffer
console.log('First byte of bufferFromString:', bufferFromString[0]);

// Slice a portion of the buffer
console.log('Sliced buffer (0–3):', bufferFromString.slice(0, 3).toString());

// Concatenate multiple buffers
const concatenatedBuffer = Buffer.concat([allocatedBuffer, bufferFromString]);
console.log(concatenatedBuffer, 'Concatenated buffer');

// Convert buffer to JSON representation
console.log(concatenatedBuffer.toJSON(), 'Buffer as JSON');
