import VideoDb from "./model";
import IVideoDoc from "./dto";
import { Types } from "mongoose";
import fs from 'fs';
import util from 'util';

export default class Video{
	/**
	 * Add info to database about video
	 * @param data 
	 * @returns 
	 */
	static async createVideo(data: VideoInfo.IVideoInfo) : Promise<IVideoDoc>{
		return await VideoDb.create(data);
	}

	/**
	 * Is used to check video exist or not
	 * @param fileName 
	 * @param owner 
	 * @returns 
	 */
	static async checkVideoExist(fileName: string, owner: Types.ObjectId) : Promise<boolean> {
		const existVideo = await VideoDb.findOne({fileName, owner});
		if (existVideo){
		  return true;
		}
		return false;
	}

	/**
	 * Get video by owner
	 * @param owner 
	 * @param page 
	 * @returns 
	 */
	static async getVideoArrey(owner: Types.ObjectId,page: number = 1) : Promise<IVideoDoc[]>{
		const videos = await VideoDb.find({owner}).skip((page-1)*10).limit(10);
		return videos;
	}

	/**
	 * delete video by id
	 * @param videoId 
	 * @returns 
	 */
	static async deleteVideo(videoId: Types.ObjectId) : Promise<IVideoDoc | null>{
		try {
			const video = await VideoDb.findById(videoId).select('filePath fileName').lean();
			const unlinkAsync = util.promisify(fs.unlink);
			if(video){
				await Promise.all([
					unlinkAsync(video.filePath),
					VideoDb.findByIdAndDelete(videoId)
				]);
			}
			return video
		} catch (error) {
			throw error
		}
	}
	
	/**
	 * get file path by id
	 * @param videoId 
	 * @returns 
	 */
	static async getFilePathById(videoId: Types.ObjectId, ownerId: Types.ObjectId) : Promise<string | null>{
		const video = await VideoDb.findById(videoId).select('filePath owner').lean();
		if(video && video.owner.equals(ownerId)){
			return video.filePath;
		}
		return null;
	}
}
