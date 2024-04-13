import { NextFunction, Request, Response } from "express";

const TestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('oleg')

  next()
};

export default TestMiddleware;