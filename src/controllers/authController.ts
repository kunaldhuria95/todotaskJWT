import User from "../models/User"
import { Response, Request, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, CustomAPIError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../errors"
import asyncHandler from "../utils/asyncHandler"
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
interface JwtPayload {
    _id: string
}

//function to return access and refresh token
const generateAccessAndRefreshToken = async function (userId: mongoose.Types.ObjectId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('No User found')
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error: any) {

        throw new CustomAPIError(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

// register a user with name,email and password fields and attach cookies(access and refresh token) to response
const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new BadRequestError('"All fields (name, email, and password) are required"')
    }

    const user = await User.create({ name, email, password })
    const { password: removedPassword, ...userWithoutPassword } = user.toObject();


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ "User": userWithoutPassword, accessToken, refreshToken })


})

//login with email and password, attach cookies(access and refresh token) to response
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('"All fields ( email and password) are required"')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new NotFoundError('No User Exists')
    }

    const isPasswordCorrect = await user.comparePassword(password.toString());

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Wrong Password')
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const { password: removedPassword, refreshToken: removedRefresh, ...loggedInUser } = user.toObject();


    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ user: loggedInUser, accessToken, refreshToken })



})

// controller to refresh access token.
const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshtoken) {
        throw new UnauthorizedError('unauthorized request')
    }
    const decodedToken = jwt.verify(incomingRefreshtoken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
    const user = await User.findById(decodedToken?._id)
    if (!user) {
        throw new UnauthorizedError('Invalid refresh token')
    }

    //check if incomingRefreshToken is the one present in the database and is not expired
    if (incomingRefreshtoken !== user?.refreshToken) {
        throw new UnauthorizedError('Refresh Token Expired')
    }

    const options = {
        httpOnly: true,
        secure: true,
    }
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({ "msg": "Token Refreshed", accessToken, refereshToken: newRefreshToken })
})

//clear cookies (access and refresh token) when logging out
const logout = asyncHandler(async (req: Request, res: Response) => {

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            refreshToken: null
        }
    },
        { new: true }
    )
   

    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ "success": "User Logged Out " })
})


export { register, login, logout, refreshAccessToken }