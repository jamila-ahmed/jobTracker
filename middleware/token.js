import jwt from "jsonwebtoken"


export const tokenMiddleware = (req, res, next) => {
    try {

    
    const authHeader = req.headers.authorization


    if(!authHeader || !authHeader.startsWith("Bearer ")) {
       return res.status(401).json({
            status: "failed",
            message: "No token provided"
        })
    }

       const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey")

        req.userId = decoded.userId

        next()

       } catch (error) {
        return res.status(401).json({
            status: "failed",
            message: "Invalid or expired token"
        })
       }
}