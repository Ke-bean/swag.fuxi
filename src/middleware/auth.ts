import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "config";

interface CustomRequest extends Request {
    user?: any; 
}

export function auth(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided");
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
}

export default CustomRequest;