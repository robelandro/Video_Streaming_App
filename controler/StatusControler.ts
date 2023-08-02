import { Request, Response } from 'express';
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
  static getIndex(req: Request, res: Response) {
    const header = {'Content-Type': 'text/html'};
    res.writeHead(200, header);
    fs.readFile('./view/main.html', (err, data) => {
      if (err) {
        res.end('error');
      } else {
        res.end(data);
      }
    });
  }
}

export default StatusControler;
