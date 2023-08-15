import { Response , NextFunction} from "express"
import fs from 'fs';

export const loginPageRender = (res: Response, next: NextFunction)=>{
  const header = {'Content-Type': 'text/html'};
  res.writeHead(200, header);
  fs.readFile('./dist/public/.view/login.html', (err, data) => {
    if (err) {
      next(err);
    } else {
      res.end(data);
    }
  });
}

export const mainPageRender = (res: Response, next: NextFunction)=> {
	const header = {'Content-Type': 'text/html'};
    res.writeHead(200, header);
    fs.readFile('./dist/public/.view/main.html', (err, data) => {
      if (err) {
        next(err);
      } else {
        res.end(data);
      }
    });
}
