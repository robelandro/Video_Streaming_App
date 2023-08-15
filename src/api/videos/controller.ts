import { RequestHandler } from "express"
import fs from "fs"
import AppError from "../../utils/apperror";
import randomUUID from "crypto";
import configs from "../../configs";
import Video from "./dal";
import cache from "../../utils/cache";

export const uploadVideo : RequestHandler = async (req, res, next) => {
  try {
    const headers = <VideoRequest.IVideoHeader>req.value;
    const userDoc = <UserRequest.IUserInfo>req.user;
    const fileNamePath =`${configs.uploadDir}/${randomUUID.randomUUID()}`
    const videoInfo = <VideoInfo.IVideoInfo>{
      fileName: headers["content-name"],
      fileSize: parseInt(headers["content-length"]),
      fileType: headers["content-type"],
      filePath: fileNamePath,
      owner: userDoc.id,
      isPublic: false
    };

    // checking Video existance
    if (await Video.checkVideoExist(videoInfo.fileName, videoInfo.owner)) throw new AppError('Video aready exist', 409);
 
    // creating uploads folder
    if (!fs.existsSync(configs.uploadDir)) {
      fs.mkdirSync(configs.uploadDir);
    }

    // creating file stream
    const file = fs.createWriteStream(fileNamePath);

    // writing file
    file.on("error", (err) => {
      if (err) {
        throw new AppError(err.message, 500);
      }
    });
    req.on("data", (chunk) => {
      file.write(chunk);
    });
    // file upload completed
    req.on("end", async () => {
      file.end();
      // saving video info to db
      const videoDoc = await Video.createVideo(videoInfo);
      // sending response
      res.status(201).json({
        status: "success",
        message: "Video uploaded successfully",
        data: {
          videoDoc
        }
      });
    });
  } catch (error) {
    next(error);
  }
}

export const getVideoList : RequestHandler = async (req, res, next) => {
  try {
    const { page } = <VideoRequest.IVideoPage>req.value;
    const userDoc = <UserRequest.IUserInfo>req.user;
    const videos = await Video.getVideoArrey(userDoc.id, page);
    res.status(200).json({
      status: "success",
      message: "Video list fetched successfully",
      data: {
        videos
      }
    });
  } catch (error) {
    next(error);
  }
}

export const videoDelete: RequestHandler = async (req, res, next) => {
  try {
    const { id } = <VideoRequest.IVideoId>req.value;
    const userDoc = <UserRequest.IUserInfo>req.user;
    cache.delete(id.toString()+userDoc.id.toString());
    const videoDoc = await Video.deleteVideo(id);
    if (!videoDoc) throw new AppError('Unable to Delete', 400);
    res.status(200).json({
      status: "success",
      message: `${videoDoc.fileName} deleted successfully`,
    });
  }
  catch (error) {
    next(error);
  }
};

export const videoStream: RequestHandler = async (req, res, next) => {
  try {
    const { id } = <VideoRequest.IVideoId>req.value;
    const userDoc = <UserRequest.IUserInfo>req.user;

    // Get the video by id from cache
    let videoPath = cache.get(id.toString()+userDoc.id.toString());  // TODO: get video from cache using both id and user id

    // Ensure there is a range given for the video
    const { range } = req.headers;
    if (!range) throw new AppError('Range header is required', 400);

    // get video path from db if not found in cache
    if(!videoPath){
      videoPath = await Video.getFilePathById(id, userDoc.id);
      if (!videoPath) throw new AppError('Video not found', 404);
      cache.push(id.toString()+userDoc.id.toString(), videoPath);
    }

    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, "")); // replace all non digit characters with nothing
    const end = Math.min(start + CHUNK_SIZE, videoSize); // geting new size of chunk

    // Create headers
    const contentLength = end - start;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, {
      start,
      end,
    });

    // Stream the video chunk to the client
    videoStream.pipe(res);

  }
  catch (error) {
    next(error);
  }
}
