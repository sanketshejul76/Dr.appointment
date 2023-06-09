const jwt = require("jsonwebtoken")
exports.authProtected = (req, res, next) => {
    if (!req.cookies) {
        return res.status(401).json({
            message: "No Cookie Found"
        })
    }
    const { token } = req.cookies
    if (!token) {
        return res.status(401).json({ message: "token missing" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        console.log(err)
        if (err) {
            return res.status(401).json({ message: "invalid token" })
        }
        const { id, role } = decode
        if (role === "user") {
            req.body.userId = id
        } else if (role === "doctor") {
            req.body.doctorId = id
        }
        req.body.role = role
        next()
    })

} 