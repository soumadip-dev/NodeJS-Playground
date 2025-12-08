// Import
const firstModule = require('./first_module');

console.log(firstModule.add(10, 20));
console.log(firstModule.subtract(20, 10));
try {
  console.log('Trying to divide by zero');
  let result = firstModule.divide(0, 0);
  console.log(result);
} catch (error) {
  console.error('Caught an error:', error.message);
}
