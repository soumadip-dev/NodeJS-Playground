import type { Request, Response } from 'express';
import type { MessageResponse } from '../interfaces/message-response';
import type { ErrorResponse } from '../interfaces/error-response';
import logger from '../utils/logger.utils';
import { validateRegister } from '../utils/validation.utils';
import { User } from '../models/User.model';
import generateTokens from '../utils/generateToken.utils';

//* Controller to register user
const registerUser = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  logger.info('Register endpoint hit');
  try {
    // Validate incoming request body
    const { error } = validateRegister(req.body);

    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn('User registration failed: Email or username already exists');
      return res.status(409).json({
        success: false,
        message: 'Email or username already taken',
      });
    }

    // Create new user
    user = new User({ username, email, password });

    await user.save();
    logger.info(`User registered successfully with ID: ${user._id}`);

    // Generate access and refresh tokens
    const { acccessToken, refreshToken } = await generateTokens(user);

    return res.status(201).json({
      message: 'User registered successfully!',
      success: true,
      data: { acccessToken, refreshToken },
    });
  } catch (error) {
    logger.error('Error during user registration', error); // Log unexpected errors
    return res.status(500).json({
      message: 'Registration failed due to server error',
      success: false,
      errors: error instanceof Error ? [error.message] : undefined,
    });
  }
};

//* Controller to login user

//* Controller to refresh token

//* Controller for logout

export { registerUser };
