import {NextFunction, Request, Response} from 'express';
import userService from "../servises/user.servise";

class userController {
    public getProfile = async (req: Request, res: Response, next:NextFunction) => {
        const data = await userService.getProfile(res.locals.user.id);
        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json(data)
        }
      return next()
    }

    public editProfile = async (req: Request, res: Response) => {
        const body = req.body
        body.file = req.file
        const user = res.locals.user
            const data = await userService.editProfile({body,user})
        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json(data)
        }
    }
}

export default new userController();