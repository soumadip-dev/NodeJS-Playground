import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { db } from './db';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET_KEY is not defined');
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// ==============================
// Register
// ==============================

app.post('/register', async (req: Request, res: Response) => {
  const { name, age, email, password } = req.body;

  if (!name || !age || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  try {
    const users = await db.query(`SELECT email FROM users WHERE email = $1`, [email]);

    if (users.rowCount && users.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists ⚠️',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newlyCreatedUser = await db.query(
      `INSERT INTO users (name, age, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, age`,
      [name, age, email, hashedPassword]
    );

    const user = newlyCreatedUser.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully 🎉',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

// ==============================
// Login
// ==============================

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields ⚠️',
    });
  }

  try {
    const result = await db.query(
      `SELECT id, name, email, password
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0] as User | undefined;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid credentials ⚠️',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials ⚠️',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully 🎉',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

// ==============================
// Current User
// ==============================

app.get('/user', async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login required ⚠️',
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    const result = await db.query(
      `SELECT id, name, email, age
       FROM users
       WHERE id = $1`,
      [payload.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        message: 'User not found ⚠️',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User found successfully 🎉',
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
