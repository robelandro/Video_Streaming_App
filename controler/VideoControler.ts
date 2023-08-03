import { Request, Response, NextFunction } from "express";
import fs from "fs";
import Video from "../util/video";
import user from "../util/user";
import randomUUID from "crypto";
import { Types } from "mongoose";
import cache from "../util/cache";
import RiseError from "../util/error";

class VideoControler {
  /**
   * Return stream of bytes of video by id
   * @param req
   * @param res
   */
  static async getVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      let videoPath: string | null = null;

      // Ensure there is a range given for the video
      const { range } = req.headers;
      if (!range) {
        res.writeHead(400).end("Requires Range header");
        return;
      }

      // check if video is in cache
      videoPath = cache.get(id as string);
      if (!videoPath) {
        // get video path
        videoPath = await user.getVideoPath(
          id as unknown as Types.ObjectId,
          res.locals.userId as Types.ObjectId
        );
        cache.push(id as string, videoPath);
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
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * upload video handler
   * @param req
   * @param res
   */
  static async postVideo(req: Request, res: Response, next: NextFunction) {
    try {
      // header info
      const { headers } = req;
      const fileNameHeader = headers["content-name"];
      const fileTypeHeader = headers["content-type"];
      const fileSizeHeader = headers["content-length"];
      const fileNamePath: string = `./uploads/${randomUUID.randomUUID()}`;
      // check if file name is provided and other info about file
      if (!fileNameHeader || !fileTypeHeader || !fileSizeHeader) {
        throw new RiseError(400, 'File name, type or size is not provided');
      } else {
        // creating uploads folder
        if (!fs.existsSync("./uploads")) {
          fs.mkdirSync("./uploads");
        }

        const newVideo = new Video(
          fileNameHeader as string,
          fileTypeHeader as string,
          parseInt(fileSizeHeader as string),
          false
        );

        const Videos = await newVideo.upload(res, fileNamePath);

        const file = fs.createWriteStream(fileNamePath);
        file.on("error", (err) => {
          if (err) {
            throw new RiseError(400, 'Error while uploading file');
          }
        });
        req.on("data", (chunk) => {
          file.write(chunk);
        });
        req.on("end", async () => {
          file.end();
          await Videos.save();
          await user.addToVideoList(res.locals.userId, Videos._id);
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("File uploaded");
        });
      }
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get Video list
   * @param req
   * @param res
   */
  static async getListVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { page } = req.query; // page number
      const userId: Types.ObjectId = res.locals.userId;
      const videos = await user.getAllVideosList(
        userId,
        parseInt(page as string)
      );
      res.status(200).send(videos).end();
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * delete video by id
   * @param req 
   * @param res 
   */
  static async deleteVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const userId: Types.ObjectId = res.locals.userId;
      await user.deleteVideo(id, userId); // delete video from user list
      res.status(200).json({ message: "Video deleted" }).end();
    } catch (error: any) {
      next(error);
    }
  }
}

export default VideoControler;
