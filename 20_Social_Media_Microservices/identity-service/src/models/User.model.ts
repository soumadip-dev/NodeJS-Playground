import mongoose, { Document, Model } from 'mongoose';
import argon2 from 'argon2';

//* Interface representing a User document in MongoDB
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

//* Mongoose schema for User
const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  { timestamps: true }
);

//* Pre-save middleware to hash the password before saving
userSchema.pre<IUser>('save', async function () {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
});

//* Method to compare a candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

//*Create a text index on the username field for efficient text search
userSchema.index({ username: 'text' });

//* Mongoose model for User
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
