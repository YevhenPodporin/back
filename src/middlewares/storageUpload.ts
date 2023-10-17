import multer from 'multer';
import {NextFunction, Request, Response} from 'express';
import {userEditProfileValidate, userRegisterValidate} from '../validation/userValidation';
import {UserRegisterWithoutFile} from '../types/UserTypes';
import {MAX_FILE_SIZE} from "../constants/constants";

const fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const fileStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file) {
                const body: UserRegisterWithoutFile = req.body
                const error = req.path.includes('edit') ? userEditProfileValidate(body) : userRegisterValidate(body)
                if (error) {
                    cb({
                        name: 'validation_error',
                        message: JSON.stringify(error)
                    }, '')
                } else {
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
        if (fileTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb({name:'Filetype error', message:'Valid types'+JSON.stringify(fileTypes.toString())})
        }
    },
}).single('file')

const uploadFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    fileStorage(req, res, function (errors) {
        const body: UserRegisterWithoutFile = req.body
        const error = req.path.includes('edit') ? userEditProfileValidate(body) : userRegisterValidate(body)
        if (error) {
            return res.status(400).json(error);
        }
        if (errors) {
              return   res.status(400).json({errors: [errors.message]});
        } else {
            next()
        }
    })
}

export default uploadFileMiddleware