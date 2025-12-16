import type { Document } from 'mongoose';

import mongoose from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  age: number;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    age: Number,
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export { User, IUser };
