import { Document, Types } from "mongoose"

export default interface IVideoDoc extends Document{
	fileName: string;
	filePath: string;
	fileSize: number;
	fileType: string;
	owner: Types.ObjectId;
	isPublic: boolean;
	uploadDate: Date;
}

declare global {
  namespace VideoRequest {
    interface IVideoHeader {
	  "content-name": string;
	  "content-type": string;
	  "content-length": string;
    }

	interface IVideoPage {
		page: number;
	}

	interface IVideoId {
		id: Types.ObjectId;
	}
  }

  namespace VideoInfo {
	interface IVideoInfo {
	  fileName: string;
	  fileSize: number;
	  fileType: string;
	  filePath: string;
	  owner: Types.ObjectId;
	  isPublic: boolean;
	}
  }
}
