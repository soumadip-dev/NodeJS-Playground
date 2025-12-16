// Basic TypeScript data types, structures, and functions 🧩

// Boolean
let isDone: boolean = false;

// Number
let num: number = 100;

// String
let str: string = 'ABC';

// Number array
let list: number[] = [1, 2, 3];

// String arrays (two valid syntaxes)
let products: string[] = ['Product1', 'Product2', 'Product3'];
let productsAlt: Array<string> = ['Product1', 'Product2', 'Product3'];

// Any type (can hold any value ⚠️)
let randomValue: any = 4;
randomValue = 'Soumadip';
randomValue = [];
randomValue = true;

// Undefined and null
let x: undefined = undefined;
let y: null = null;

// Enum
enum Color {
  Red,
  Green,
  Blue,
}

let selectedColor: Color = Color.Green;

// Tuple (fixed type and order)
let tupleValue: [string, number] = ['Hi', 400];

// Interface
interface User {
  name: string;
  id: number;
  email?: string; // optional field
  readonly createdAt: Date; // cannot be modified ⛔
}

const user: User = {
  name: 'Soumadip',
  id: 1,
  createdAt: new Date(),
  email: 'soumadip@gmail.com',
};

// Type alias
type Product = {
  title: string;
  price: number;
};

const product1: Product = {
  title: 'Sample Product 🛒',
  price: 5,
};

// Function with type annotations
function multiply(a: number, b: number): number {
  return a * b;
}

// Arrow function with typed parameters and return type
const add = (num1: number, num2: number): number => {
  return num1 + num2;
};

// Function with optional parameter
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${name}, ${greeting} 😊`;
  }
  return `${name}, how are you?`;
}
