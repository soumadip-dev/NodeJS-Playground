const lodash = require('lodash');

const names = ['Soumadip', 'Rohit', 'Subham', 'Abhishek'];

const capitalize = lodash.map(names, lodash.capitalize);

console.log(capitalize);
