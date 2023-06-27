import {Request,Response} from "express";

export type RequestWithBody<T> = Request<{},{},{}, T>;
export type RequestWithQuery<T> = Request<{},{},{}, T>;
export type RequestWithParams<T> = Request<T>;
