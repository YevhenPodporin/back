"use strict";
// import {NextFunction, Request,Response} from "express";
//
// const jwt = require('../utils/jwt.js');
//
// const createError = require('http-errors')
// const auth = async (req:Request, res:Response, next:NextFunction) => {
//     if (!req.headers.authorization) {
//         return next(createError.Unauthorized('Access token is required'))
//     }
//     const token = req.headers.authorization.split(' ')[1]
//     if (!token) {
//         return next(createError.Unauthorized())
//     }
//     await jwt.verifyAccessToken(token).then((user:any) => {
//         req.user = user
//         next()
//     }).catch ((e:any) => {
//         next(createError.Unauthorized(e.message))
//     })
// }
// export default auth;
