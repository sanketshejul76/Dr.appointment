const reateLimiter = require("express-rate-limit")

exports.limiter = reateLimiter({
    windowMs: 60 * 1000,
    max: 1,
    message: "Too many accounts created from this IP",
    handler: (req, res, next, options) => {
        res.status(429).json({
            message: "too many request, please try after 1 min"
        })
    }
})