import {NextFunction, Request, Response} from 'express';
import userService from "../servises/user.servise";

class userController {
    static getProfile = async (req: Request, res: Response, next: NextFunction) => {
        const currentUrl = `${req.protocol}://${req.get('host')}/`

        const data = await userService.getProfile({...req.body,currentUrl});
        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json({
                ...data
            })
        }
    }
    static editProfile = async (req: Request, res: Response, next: NextFunction)=>{

        const data = await userService.editProfile({user: {...req.body},file:req.file || null})
        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json({
                ...data
            })
        }
    }
}

export default userController;