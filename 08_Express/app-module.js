const express = require('express');

const app = express();

const port = 8080;

// Application-level settings
app.set('view engine', 'ejs');

// Routing
app.get('/', (req, res) => {
  res.send('Home page 🏠');
});

app.post('/api.data', (req, res) => {
  res.json({
    message: 'Data received 📦',
    data: req.body,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something went wrong ❌');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
