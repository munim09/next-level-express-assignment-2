import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../utils/sendResponse";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    //   console.error(err.stack);

    // res.status(500).json({
    //     success: false,
    //     message: err.message || "Internal Server Error",
    // });

    sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: err.message || "Internal Server Error",
        error: err,
    });
};

export default globalErrorHandler;
