export {};

declare global {
	namespace Express {
		interface Request {
			user: object;
			value: object;
		}
	}
}
