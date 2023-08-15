import IUserDoc from "./dto";
import UserModel from "./model";
import AppError from "../../utils/apperror";

export default class Users{
  /**
   * New User
   * @param user 
   * @returns 
   */
  static async CreateNew(user: UserRequest.IUserInput): Promise<IUserDoc>{
    const isUserNameExist = await UserModel.findOne({userName: user.userName});
    if (isUserNameExist){
      throw new AppError("User Name Already Exist", 400);
    }
    const newUser = await UserModel.create({
      userName: user.userName,
      password: user.password
    });
    return newUser;
  }

  /**
   * user login info
   * @param user 
   * @returns 
   */
  static async userLogin(user: UserRequest.IUserInput): Promise<IUserDoc>{
    const userDoc = await UserModel.findOne({userName: user.userName});
    if (!userDoc || !(await userDoc.comparePassword(user.password, userDoc.password))){
      throw new AppError("Invalid User Name or Password", 400);
    }
    return userDoc;
  }

  /**
   * Get username by userName 
   * @param userName 
   * @returns if founed return IUserDoc else false
   */
  static async getByUserName(userName: string) : Promise<IUserDoc | undefined>{
    const userDoc = await UserModel.findOne({userName});
    if(!userDoc){
      return undefined;
    }
    return userDoc;
  }
}
