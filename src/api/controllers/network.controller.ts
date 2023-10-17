import { Request, Response} from 'express';
import networkService from "../servises/network.serviсe";
import {
    PaginationParamsValidate,
    requestToFriendValidate
} from "../../validation/userValidation";
import {JwtPayload, PaginationParams} from "../../types/UserTypes";

class networkController {
    public getUsersList = async (req: Request, res: Response) => {
        const params: PaginationParams = req.query
        const error = PaginationParamsValidate(params)
        if (error) {
            return res.status(400).json(error)
        }
        const user: JwtPayload = res.locals.user
        const currentUrl = `${req.protocol}://${req.get('host')}/image/`
        const data = params.filter?.status === 'APPROVED'
            ? await networkService.getMyFriends({user, currentUrl, params})
            : params.filter?.status === 'REQUEST'
                ? await networkService.getRequests({user, currentUrl, params})
                :await networkService.getAllUsers({user,currentUrl,params})

        if (data?.error) {
            res.status(404).json({
                error: data.error,
            })
        } else {
            res.status(200).json(data)
        }
        return res.status(200)
    }
    public userRequest = async (req: Request, res: Response) => {
        const data = {
            from_user_id: res.locals.user.id.toString(),
            to_user_id: req.body.to_user_id.toString(),
            status: req.body.status
        }

        const error = requestToFriendValidate(data)
        if (error) {
            return res.status(400).json(error)
        }

        const result = await networkService.addToFriend(data)
        if (result.errors) {
            return res.status(400).json(result)
        }
        return res.status(200).json(result)
    }
}

export default new networkController();