import multer, { ErrorCode } from 'multer';
import {NextFunction, Request, Response} from 'express';
import {userRegisterValidate} from '../validation/userValidation';
import {UserRegisterWithoutFile} from '../models/UserModel';
import {MAX_FILE_SIZE} from "../constants/constants";

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const fileStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const body: UserRegisterWithoutFile = req.body
            const { error} = userRegisterValidate(body)
            if (error) {
                const formattedErrors = error.details.map(({message}) => message)
                cb({
                        message: JSON.stringify(formattedErrors),
                        name: 'validation_error'
                    }, process.cwd() + '/src/storage/files')
                return;
            }

            cb(null, process.cwd() + '/src/storage/files')
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
        const sizeLimit: ErrorCode = 'LIMIT_FILE_SIZE';
        if(!errors) return next();

        if (errors.code === sizeLimit) {
            console.log(errors.message)
            res.status(400).json({errors:[errors.message]});
        } else {
            res.status(400).json({errors});
        }
    })
}


export default uploadFileMiddleware