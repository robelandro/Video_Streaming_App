import rateLimit from 'express-rate-limit'

export default rateLimit({
	windowMs: 60 * 5000, // 5 min
	max: 10, // Limit each IP to 10 requests per 10
	message:{message: `Too many requests, please try again later. after 5 min`},
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
