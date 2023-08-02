import { Schema, model } from 'mongoose';
import { VideoType } from '../interface';

const videoSchema = new Schema<VideoType>({
	fileName: { type: String, required: true },
	fileType: { type: String, required: true },
	fileSize: { type: Number, required: true },
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	ispublic: { type: Boolean, required: true },
	date: { type: Date, required: true },
	filePath: { type: String, required: true }
});

const Video = model<VideoType>('Video', videoSchema);

export default Video;
