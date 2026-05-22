import type { Request, Response } from "express";
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
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
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

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
};
const getSingleIssues = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await issueService.getSingleIssue(Number(id), res);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
};

const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
};

const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
};

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssues,
    updateIssue,
    deleteIssue,
};
