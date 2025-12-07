const EventEmitter = require('events');

const myFirstEmitter = new EventEmitter();

// Register a listener to greet the user
myFirstEmitter.on('greet', name => {
  console.log(`Hello ${name} 😊`);
});

// Trigger the greet event with a name
myFirstEmitter.emit('greet', 'Soumadip');
