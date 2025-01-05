import { Response, Request, NextFunction } from "express"
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<any> | void;

// to catch error in controller instead of writing try catch everytime.
const asynHandler = (fn: MiddlewareFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err))
    }

}
export default asynHandler