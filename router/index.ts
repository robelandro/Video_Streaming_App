import StatusControler  from '../controler/StatusControler';
import UserControler from '../controler/UserControler';
import VideoControler from '../controler/VideoControler';
import AuthControler from '../controler/AuthControler';

import { Application } from 'express';

const map = (app: Application) : void => {
	app.get('/', StatusControler.getIndex);
	app.get('/status', StatusControler.getStatus);
	app.get('/video', VideoControler.getVideo);
	app.get('/listVideo', VideoControler.getListVideo);
	app.post('/users', UserControler.newUser);
	app.post('/connect', AuthControler.conncet);
	app.put('/disconnect', AuthControler.disconnect);
	app.post('/videoUpload', VideoControler.postVideo);
	app.delete('/deleteVideo', VideoControler.deleteVideo);
};

export default map;
