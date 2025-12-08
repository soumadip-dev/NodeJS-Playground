const path = require('path');

console.log('Current Directory:', path.dirname(__filename)); // Directory name of the current file

console.log('Current File:', path.basename(__filename)); // Name of the current file

console.log('Current File Extension:', path.extname(__filename)); // Extension of the current file

// Joins multiple path segments into a single path using the correct separator
const combinedPath = path.join('/user', 'document', 'node', 'projects');
console.log('Combined Path:', combinedPath);

// Resolves the given path segments into an absolute path - It starts from the current working directory if no absolute path is provided
const absolutePath = path.resolve('user', 'document', 'node', 'projects');
console.log('Absolute Path:', absolutePath);

// Normalizes a path by resolving '..', '.', and removing redundant separators
const cleanedPath = path.normalize('/user/.document/../node/projects');
console.log('Cleaned Path:', cleanedPath);
