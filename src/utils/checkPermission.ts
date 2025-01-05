import mongoose from "mongoose";
import { UnauthorizedError } from "../errors";

const checkPermission = (requestUser: mongoose.Types.ObjectId, resourceUserId: mongoose.Types.ObjectId) => {

    if (requestUser.toString() === resourceUserId.toString()) return

    throw new UnauthorizedError('Not authorized to access this route')
}
export { checkPermission }