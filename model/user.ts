import { Schema, model } from 'mongoose';
import { UserType } from '../interface';

const userSchema = new Schema<UserType>({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  listOfVideo: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
});
  
const User = model<UserType>('User', userSchema);

export default User;
