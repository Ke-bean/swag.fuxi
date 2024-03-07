import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any; 
}

export function isAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user.isAdmin) return res.status(403).send("Access denied.");
        next();
    } catch (ex) {
        res.status(403).send("Access denied");
    }
}
