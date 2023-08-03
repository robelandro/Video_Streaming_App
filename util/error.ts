import { ErrorType } from "../interface";
class RiseError extends Error implements ErrorType{
	status: number;
	/**
	 * generate new error
	 * @param status http status code
	 * @param message error message
	 */
	constructor(status: number,message: string) {
		super(message);
		this.status = status;
	}
}

export default RiseError;
