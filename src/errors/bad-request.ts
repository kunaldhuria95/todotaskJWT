import CustomAPIError from "./custom-api";
import { StatusCodes } from "http-status-codes";
class BadRequestError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST)

    }
}
export default BadRequestError