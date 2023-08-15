import { Schema, model } from 'mongoose';
import IVideoDoc from './dto';

const videoSchema = new Schema<IVideoDoc>({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, required: true },
  uploadDate: { type: Date, default: Date.now() }
});

const Video = model<IVideoDoc>('Video', videoSchema);
 
export default Video;
