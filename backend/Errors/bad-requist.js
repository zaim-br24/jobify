import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

export default class BadRequistError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}