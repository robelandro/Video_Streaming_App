import { VideoTypeClass, VideoType } from "../interface";
import { Types } from 'mongoose';
import { Response } from 'express';
import Videodb from "../model/video";
import RiseError from "./error";

class Video implements VideoTypeClass {
  _id!: Types.ObjectId;
  date?: number | undefined;
  filePath?: string | undefined;
  fileName: string;
  fileType: string;
  fileSize: number;
  owner?: Types.ObjectId;
  ispublic: boolean;
  save!: () => Promise<VideoType>;
  constructor(fileName: string, fileType: string, fileSize: number, ispublic: boolean) {
	this.fileName = fileName;
	this.fileType = fileType;
	this.fileSize = fileSize;
	this.ispublic = ispublic || false;
  }

  /**
   * upload video handler
   * @param req 
   * @returns {Promise<VideoType>}
   */
  async upload(res: Response, fileNamePath: string): Promise<VideoType> {
    const userId : Types.ObjectId = res.locals.userId;
    // check the file aready exist
    const videoExist = await Videodb.findOne({ fileName: this.fileName, owner: userId });
    if (videoExist?.fileSize === this.fileSize && videoExist?.fileType === this.fileType){
      throw new RiseError(400, 'File already exist');
    }
    // create new video
    const video = new Videodb({
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      owner: userId,
      ispublic: this.ispublic,
      date : Date.now(),
      filePath: fileNamePath
    });

    return video;
  }
}

export default Video;
