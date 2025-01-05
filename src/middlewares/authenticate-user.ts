import e, { NextFunction, Request, Response } from "express";
import asynHandler from "../utils/asyncHandler";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import jwt from 'jsonwebtoken'
import User from "../models/User";

interface JwtPayload {
    _id: string
}
//verifies the jwt token and attach user object to the response
const authenticateUser = asynHandler(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new UnauthenticatedError('No token Found')
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new UnauthenticatedError('Invalid Access Token')
    }
    req.user = user;
    next();





})
export { authenticateUser }