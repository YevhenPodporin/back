import * as fs from "fs";
import {NextFunction, Request, Response} from "express";

const sendFile = async (req: Request, res: Response) => {
    try {
        const filePath = process.cwd() + '/src/storage/files/' + req.params.file_name;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        const fileStream = fs.createReadStream(filePath);
      return   fileStream.pipe(res);
    } catch (e) {
       return  res.status(500).json({error: 'Internal error'})
    }

};
export default sendFile