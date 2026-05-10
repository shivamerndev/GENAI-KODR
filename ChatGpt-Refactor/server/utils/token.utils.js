import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../configs/env.js"


const generateToken = (data) => {
    return jwt.sign(data, JWT_SECRET)
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

export { generateToken, verifyToken }