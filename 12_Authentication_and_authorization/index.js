const dotenv = require('dotenv');
const express = require('express');
const connectDb = require('./database/db.js');
const userRouter = require('./routes/auth.routes.js');
const homeRouter = require('./routes/home.routes.js');
const adminRouter = require('./routes/admin.routes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON requests
app.use(express.json());

// Application routes
app.use('/api/auth', userRouter);
app.use('/api/home', homeRouter);
app.use('/api/admin', adminRouter);

// Start server after successful database connection
const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log('Server is running on port:', PORT);
    });
  } catch (error) {
    console.error('Failed to start the server');
  }
};

startServer();
