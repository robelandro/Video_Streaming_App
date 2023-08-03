import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

/**
 * class to check the status of the server
 */
class StatusControler {
  /**
   * send the status of the server
   * @param {Request} req
   * @param {Response} res
   */
  static getStatus(req: Request, res: Response) {
    res.status(200).json({status: 'ok'});
  }

  /**
   * send the index page
   * @param {Request} req
   * @param {Response} res
   */
  static getIndex(req: Request, res: Response, next: NextFunction) {
    const header = {'Content-Type': 'text/html'};
    res.writeHead(200, header);
    fs.readFile('./view/main.html', (err, data) => {
      if (err) {
        next(err);
      } else {
        res.end(data);
      }
    });
  }
}

export default StatusControler;
