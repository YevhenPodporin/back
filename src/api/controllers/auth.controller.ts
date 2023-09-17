import {NextFunction, Request, Response} from 'express';
import AuthServises from "../servises/auth.servise";
import {UserRegisterWithoutFile} from "../../types/UserTypes";
import {useLoginValidate} from "../../validation/userValidation";


class authController {
    public register = async (req: Request, res: Response) => {
        const body: UserRegisterWithoutFile = req.body
            const data = await AuthServises.register({...body, file: req?.file});
            if (data.error) {
                res.status(404).json(data)
            } else {
                res.status(200).json({
                    message: 'User created successfully',
                    data
                })
        }
    }
    public login = async (req: Request, res: Response) => {
        const errors = useLoginValidate(req.body);
        if (errors) {
            res.status(400).json({
                errors,
                name: 'validation_error'
            })
        } else {
            const {accessToken, error} = await AuthServises.login(req);
            if (error) {
                res.status(404).json({
                    error
                })
            } else {
                res.status(200).json({
                    message: "Account login successful",
                    accessToken
                })
            }
        }
    }
}

export default new authController();