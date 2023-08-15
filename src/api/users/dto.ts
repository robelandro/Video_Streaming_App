import { Document, Types } from "mongoose"

export default interface IUserDoc extends Document{
  userName: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  comparePassword: (candidatePassword: string, password: string) => Promise<boolean>;
}

declare global {
  namespace UserRequest {
    interface IUserInput {
      userName: string;
      password: string;
    }

    interface IUserInfo {
      id: Types.ObjectId;
      userName: string;
    }
  }
}
