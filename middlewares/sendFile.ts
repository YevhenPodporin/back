import * as fs from "fs";
import {NextFunction, Request,Response} from "express";

 const sendFile = async (req:Request, res:Response, next:NextFunction) => {
    const fileStream = fs.createReadStream('./'+req.path);
    fileStream.pipe(res);
};
 export default sendFile