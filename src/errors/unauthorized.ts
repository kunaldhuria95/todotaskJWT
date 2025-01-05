import CustomAPIError from "./custom-api";
import { StatusCodes } from "http-status-codes";
class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN)

    }
}
export default UnauthorizedError