# Node.js Full Course

A comprehensive learning repository for mastering Node.js, from fundamentals to advanced concepts.

## About

This repository documents my journey of learning Node.js, including examples, exercises, and projects that cover the core Node.js ecosystem.

---

## Note

### Node.js Module System

The Node.js module system allows you to organize code into multiple reusable pieces. Each file in Node.js is treated as a module.

- `module.exports` → Used to export functionality.
- `require` → Used to import functionality.

### Module Wrapper

In Node.js, every module is wrapped inside a function (IIFE) before execution. This wrapper function is called the **module wrapper function**. It provides access to the following parameters:

- `exports`: An initially empty object `{}` whose purpose is to collect values (functions, objects, etc.) that we want to make available to other modules.
- `require`: A function used to load other modules.
- `module`: An object that represents the current module.
- `__filename`: A string containing the full absolute path of the current module file.
- `__dirname`: A string containing the directory name of the current module.

```js
(function (exports, require, module, __filename, __dirname) {
  // Actual module code goes here
});
```
