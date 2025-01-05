import { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

//custom built errorHandlerMiddleware
const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later",
    };
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors!).map((item) => (item as {
            message: string
        }).message).join(",");
        customError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue!).join(
            ", "
        )}, please choose another value`;
        customError.statusCode = 400;
    }

    if (err.name === "CastError") {
        customError.msg = `No item found with id: ${err.value}`;
        customError.statusCode = 404;
    }

     res.status(customError.statusCode).json({ msg: customError.msg });
    return

};

export default errorHandlerMiddleware;
