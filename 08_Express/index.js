const express = require('express');

const app = express();
const port = 8080;

// Root route
app.get('/', (req, res) => {
  console.log(req.url);
  res.send('Hello World 🌍');
});

app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
