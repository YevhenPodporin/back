import multer, {ErrorCode} from 'multer';
import {NextFunction, Request, Response} from 'express';
import {userRegisterValidate} from '../validation/userValidation';
import {UserRegisterWithoutFile} from '../types/UserTypes';
import {MAX_FILE_SIZE} from "../constants/constants";

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const fileStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file) {
                const body: UserRegisterWithoutFile = req.body
                const error = userRegisterValidate(body)
                if (error) {
                    cb({
                        name: 'validation_error',
                        message: JSON.stringify(error)
                    }, '')
                } else {
                    console.log(2)
                    cb(null, process.cwd() + '/src/storage/files')
                }
            }

        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString().replace(/:/g, '-')
                .replace(/\./g, '-') + '-' + file.originalname)
        }
    }),
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: (req, file, cb) => {
        if (types.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    },
}).single('file')

const uploadFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    fileStorage(req, res, function (errors) {
        const body: UserRegisterWithoutFile = req.body
        const error = userRegisterValidate(body)
        if (error) {
            return res.status(400).json(error);
        }
        const sizeLimit: ErrorCode = 'LIMIT_FILE_SIZE';
        if (!errors) return next();

        if(errors){
            if (errors.code === sizeLimit) {
                res.status(400).json({errors: [errors.message]});
            } else {
                res.status(400).json(errors);
            }
        }else {
            next()
        }
    })
}


export default uploadFileMiddleware