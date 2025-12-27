import type { Request, Response } from 'express';
import type { MessageResponse } from '../interfaces/message-response';
import type { ErrorResponse } from '../interfaces/error-response';
import logger from '../utils/logger.utils';
import { validateRegister } from '../utils/validation.utils';
import { User } from '../models/User.model';

//* Controller to register user
const registerUser = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  logger.info('Register endpoint hit...');
  try {
    const { error } = validateRegister(req.body);

    if (error) {
      logger.warn('Validation error', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn('User already exists', `Email or username already taken`);
      return res.status(409).json({
        success: false,
        message: 'Email or username already taken',
      });
    }

    user = new User({ username, email, password });

    await user.save();

    logger.warn('User saved successfully', user._id);
    return res.status(201).json({
      message: 'User Register Successfully',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Registration failed',
      success: false,
      errors: error instanceof Error ? [error.message] : undefined,
    });
  }
};

//* Controller to login user

//* Controller to refresh token

//* controller for logout
