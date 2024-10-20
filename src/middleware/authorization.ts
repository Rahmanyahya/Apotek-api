import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const verifyToken = (req: Request,res: Response, next: NextFunction) => {
    try {
        
        const headers =  req.headers.authorization
        const [type, token] = headers ? headers.split(" ") : []
        const isVerified = jwt.verify(token, String(process.env.secret), (err,_) => {
            if(err) return res.status(401).json({message: "unauthorized"})
                return next()
        })
       
        
    } catch (error) {
        return res.status(401).json({error})
    }
}

export {verifyToken}