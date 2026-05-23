import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(
            token as string,
            config.jwt_secret,
        ) as JwtPayload;
        console.log("controller decode", decoded);
        const result = await issueService.createIssueIntoDB(
            req.body,
            decoded.id,
        );

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const getAllIssues = async (req: Request, res: Response) => {
    const { sort = "newest", type, status } = req.query;
    try {
        const result = await issueService.getAllIssues(
            sort as string,
            type as string,
            status as string,
            res,
        );

        if (!result) {
            sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue Not found!",
            });
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const getSingleIssues = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await issueService.getSingleIssue(Number(id), res);

        if (!result) {
            sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue Not found!",
            });
        } else {
            sendResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: result,
            });
        }
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issueService.deleteDeleteFromDB(Number(id));
        console.log(result);
        if (result.rowCount === 0) {
            sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue Not found!",
            });
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const updateIssue = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(
            token as string,
            config.jwt_secret,
        ) as JwtPayload;
        console.log("controller decode", decoded);

        const { id } = req.params;

        const result = await issueService.updateIssueFromDB(
            req.body,
            id as string,
            decoded?.role as string,
            decoded?.id as string,
        );

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue Not found!",
                data: {},
            });
        }

        // console.log(result);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
        });
    }
};

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssues,
    updateIssue,
    deleteIssue,
};
