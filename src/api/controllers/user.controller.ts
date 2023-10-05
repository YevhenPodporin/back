import {NextFunction, Request, Response} from 'express';
import userService from "../servises/user.servise";

class userController {
    public getProfile = async (req: Request, res: Response, next:NextFunction) => {
        const currentUrl = `${req.protocol}://${req.get('host')}/image/`
        const data = await userService.getProfile({email: res.locals.user.email, currentUrl});
        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json({
                ...data
            })
        }
        next()
    }

    public editProfile = async (req: Request, res: Response) => {
        const user = {user: {...req.body}, email: res.locals.user.email, file: req.file || null}
        const data = await userService.editProfile(user)
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

export default new userController();