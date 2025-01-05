import { Request, Response, NextFunction } from "express"

//not found middleware when no routes matches the request
const notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).send('Route does not exists')

}

export default notFound