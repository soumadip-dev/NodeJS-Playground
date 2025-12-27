import mongoose, { type Model } from 'mongoose';

//* Interface representing a RefreshToken document
interface IRefreshToken {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
}

//* Mongoose schema for RefreshToken
const refreshTokenSchema = new mongoose.Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

//*
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//*  Mongoose model for RefreshToken
const RefreshToken: Model<IRefreshToken> =
  mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);

export { RefreshToken };
