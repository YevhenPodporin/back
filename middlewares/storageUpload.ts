import {Request} from "express";

const multer = require('multer');
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
import {FileFilterCallback} from "multer";
export const fileStorage  = multer.diskStorage({
    destination(req:Request, file:Express.Multer.File, cb:DestinationCallback) {
        cb(null, './storage/files')
    },
    filename(req:Request, file:Express.Multer.File, cb:DestinationCallback) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    if (types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

