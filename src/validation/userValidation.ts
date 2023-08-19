import Joi from 'joi';
import { EMAIL_REGEXP } from '../constants/constants';
import { UserRegisterWithoutFile } from '../models/UserModel';

export const userRegisterValidate = (data: UserRegisterWithoutFile) => (
    Joi.object<null, true, UserRegisterWithoutFile>({
        email: Joi.string().regex(EMAIL_REGEXP).message('Email incorrect').required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
        date_of_birth: Joi.string().required(),
        last_name: Joi.string().required(),
        first_name: Joi.string().required(),
    }).validate(data,{abortEarly:false})
);
