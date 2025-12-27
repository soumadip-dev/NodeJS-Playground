import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config';
import crypto from 'crypto';
import { RefreshToken } from '../models/RefreshToken.model';
import { IUser } from '../models/User.model';

interface Tokens {
  acccessToken: string;
  refreshToken: string;
}

const generateTokens = async (user: IUser): Promise<Tokens> => {
  const acccessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    ENV.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token expires in 7 Day

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { acccessToken, refreshToken };
};

export default generateTokens;
