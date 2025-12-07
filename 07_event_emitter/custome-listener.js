const EventEmitter = require('events');

// Create a custom event emitter class
class MyCustomEmitter extends EventEmitter {
  constructor() {
    super();
    this.greeting = 'Hello';
  }

  // Method to trigger the greeting event
  greet(name) {
    this.emit('greeting', `${this.greeting}, ${name} 👋`);
  }
}

const myCustomEmitter = new MyCustomEmitter();

// Register a listener for the greeting event
myCustomEmitter.on('greeting', message => {
  console.log('Greeting event:', message);
});

// Trigger the greeting event
myCustomEmitter.greet('Soumadip Majila');
