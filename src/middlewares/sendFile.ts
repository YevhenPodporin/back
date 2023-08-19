import * as fs from "fs";
import {NextFunction, Request, Response} from "express";

const sendFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filePath = process.cwd() + '/src/storage/files/' + req.params.file_name;
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (e) {
        res.status(500).json({error: 'Internal error'})
    }

};
export default sendFile