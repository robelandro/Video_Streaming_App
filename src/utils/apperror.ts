class AppError extends Error {
	status: string;
	statusCode: number;
	/**
	 * 
	 * @param message message of the error
	 * @param statusCode status code of the error
	 */
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4',0) ? "FAIL": "ERROR";
	}
}

export default AppError;
