import Joi from 'joi';
import {
    EMAIL_REGEXP,
    EMAIL_VALIDATE_MESSAGE, NUMBER_PATTERN
} from '../constants/constants';
import {
    Direction,
    OrderBy,
    PaginationParams,
    RequestToFriend,
    UserLoginRequestBody,
    UserRegisterWithoutFile,
    UserUpdateProfileBodyWithoutFile
} from '../types/UserTypes';
import {RequestStatus} from "@prisma/client";
import {CreateChatType} from "../types/ChatTypes";

const validStatus = Object.values(RequestStatus)

export const formatError = (result: Joi.ValidationResult) => {
    if (result.error) {
        const formattedErrors = result.error.details
            .map(({message, context}) => {
                return {
                    label: context?.label, message
                }
            })
        return {errors: formattedErrors}
    }
    return null
}
export const userRegisterValidate = (data: UserRegisterWithoutFile) => {
    const res =
        Joi.object<null, true, UserRegisterWithoutFile>({
            email: Joi.string().regex(EMAIL_REGEXP).message(EMAIL_VALIDATE_MESSAGE).required(),
            password: Joi.string().trim().alphanum().min(3).max(30).required(),
            date_of_birth: Joi.string().trim().trim().required(),
            last_name: Joi.string().trim().required(),
            first_name: Joi.string().trim().required(),
        })
            .validate(data, {abortEarly: false, convert: false})
    return formatError(res);
};

export const userEditProfileValidate = (data: UserUpdateProfileBodyWithoutFile) => {
    const res =
        Joi.object<null, true, UserUpdateProfileBodyWithoutFile>({
            email: Joi.string().regex(EMAIL_REGEXP).message(EMAIL_VALIDATE_MESSAGE),
            date_of_birth: Joi.string().trim().trim(),
            last_name: Joi.string().trim(),
            first_name: Joi.string().trim(),
        })
            .validate(data, {abortEarly: false, convert: false})
    return formatError(res);
};

export const useLoginValidate = (data: UserLoginRequestBody) => {
    const res =
        Joi.object<null, true, UserLoginRequestBody>({
            email: Joi.string().trim().required(),
            password: Joi.string().trim().required()
        })
            .validate(data, {abortEarly: false, convert: false})
    return formatError(res);
}

export const PaginationParamsValidate = (data: PaginationParams) => {
    const res = Joi.object<null, true, PaginationParams>({
        filter: {
            status: Joi.string().trim().valid(...validStatus),
            search: Joi.string().trim(),
        },
        pagination: {
            take: Joi.number(),
            skip: Joi.number(),
            direction: Joi.string().valid(...Object.values(Direction)),
            order_by: Joi.string().valid(...Object.values(OrderBy))
        }
    })
        .validate(data, {abortEarly: false, convert: true})
    return formatError(res);
}

export const requestToFriendValidate = (data: RequestToFriend) => {
    const res =
        Joi.object<null, true, RequestToFriend>({
            from_user_id: Joi.string().trim().pattern(NUMBER_PATTERN).required(),
            to_user_id:  Joi.string().trim().pattern(NUMBER_PATTERN).required(),
            status: Joi.string().trim().valid(...validStatus).required()
        })
            .validate(data, {abortEarly: false, convert:true})
    return formatError(res);
}

export const createChatValidate = (data: CreateChatType) => {
    const res =
        Joi.object<null, true, CreateChatType>({
            from_user_id: Joi.number().required(),
            to_user_id:  Joi.number().required(),
        })
            .validate(data, {abortEarly: false, convert:true})
    return formatError(res);
}


