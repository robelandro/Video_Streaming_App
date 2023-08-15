import { Schema, model } from 'mongoose';
import IUserDoc from './dto';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUserDoc>({
  userName: { type: String, required: true },
  password: { type: String, required: true }
});

// Hash password
userSchema.pre("save", async function (this: IUserDoc, next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
  });

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  password: string
  ): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, password);
  };

const UserModel = model<IUserDoc>('User', userSchema);

export default UserModel;
