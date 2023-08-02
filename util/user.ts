import { UserClassType, UserType } from "../interface";
import { Types } from 'mongoose';
import UserDb from "../model/user";
import VideoDb from "../model/video";
import bcrypt from 'bcrypt';
import fs from 'fs';
import util from 'util';

class User implements UserClassType {

  /**
   * create new user on the database
   * @param userName 
   * @param password 
   * @returns {Promise<UserType>}
   */
  async addUser(userName: string, password: string): Promise<UserType> {
    try {
      // check if user exist
      const userExist = await this.checkifUserExist(userName);
      if (userExist) {
        throw new Error('User already exist');
      }
      // hash password using bcrypt
      const hashPassword = await bcrypt.hash(password, 10);
      // create new user for db
      const user = new UserDb({
        _id: new Types.ObjectId(),
        userName: userName,
        password: hashPassword
      } as UserType);
      // return user
      return user;
    } catch (err) {
      throw err;
    }
  }

  /**
   * This function retrive password from db then check with password paramter
   * @param userName 
   * @param password 
   */
  async getUser(userName: string, password: string): Promise<UserType> {
    const user = await UserDb.findOne({userName: userName});
    if (user){
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch){
        return user;
      }
      else{
        throw new Error('Password not match');
      }
    }
    else{
      throw new Error('User Not Found');
    }
  }

  /**
   * Add video to the video list
   * @param userId 
   * @param videoId 
   */
  async addToVideoList(userId: Types.ObjectId, videoId: Types.ObjectId): Promise<boolean>{
    const user = await UserDb.updateOne({_id: userId}, {$push:{listOfVideo: videoId}});
    if (user.modifiedCount > 0){
      return true;
    }{
      throw new Error('Unable to update')
    }
  }

  /**
   * Check if user exist in db
   * @param userName 
   * @returns true if user exist, false otherwise
   */
  async checkifUserExist(userName: string): Promise<boolean> {
    const user = await UserDb.findOne({ userName: userName });
    if (user) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * method to get all videos list
   * @param userId 
   * @param page 
   * @returns 
   */
  async getAllVideosList(userId: Types.ObjectId, page: number = 0): Promise<Types.ObjectId[]>{
    const videos = await UserDb.findOne({_id: userId})
    .select('listOfVideo')
    .skip(page).limit(10)
    .populate('listOfVideo');
    if (videos){
      return videos.listOfVideo as Types.ObjectId[];
    }
    else{
      throw new Error('Unable to get videos');
    }
  }

  /**
   * method to get video path
   * @param videoId 
   * @param userId 
   * @returns 
   */
  async getVideoPath(videoId: Types.ObjectId, userId: Types.ObjectId): Promise<string>{
    const videoPath = await VideoDb.findOne({_id: videoId, owner: userId}).select('filePath');
    if (videoPath){
      return videoPath.filePath as string;
    }
    else{
      throw new Error('Unable to get video path');
    }
  }

  /**
   * method to delete video
   * @param videoId 
   * @param userId 
   * @returns 
   */
  async deleteVideo(videoId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>{
    // removing for video document
    const filePath = await this.getVideoPath(videoId, userId);
    const video = await VideoDb.deleteOne({_id: videoId, owner: userId});
    const unlinkAsync = util.promisify(fs.unlink);
    const user = await UserDb.updateOne({_id: userId}, {$pull:{listOfVideo: videoId}});
    if (video.deletedCount > 0 && user.modifiedCount > 0){
      await unlinkAsync(filePath);
      console.log("file deleted");
      return true;
    }
    else{
      throw new Error('Unable to delete video');
    }
  }
}

// creating instance of user class
const user = new User();

export default user;
