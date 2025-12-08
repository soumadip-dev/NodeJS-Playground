# Node.js Full Course

A comprehensive learning repository for mastering Node.js from fundamentals to advanced concepts.

## About

This repository contains my journey learning Node.js, including examples, exercises, and projects covering the full Node.js ecosystem.

---

# NOTE:

## 01-NODE-MODULE SYSTEM

node js module system allows you to organize code into multiple reausable peaces of code.
Each file in node js is treated as module

module.exports -> export
require -> import

Module Wrapper : In node js every node js module is wrapped in a function(IIFE) before execution. This wrapper function we called module wrapper function.This function has some of the parameter like `exports`, `require`, `module`, `__filename` , `__dirname`.

```
(
  function(exports, require, module,__filename,__dirname){
    // Actual module code goes here
  }
)
```
