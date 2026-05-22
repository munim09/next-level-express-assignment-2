import type { Response } from "express";
import { pool } from "../../db";
import type { IIssue } from "../../utils/issue.interface";
import sendResponse from "../../utils/sendResponse";

const createIssueIntoDB = async (payload: IIssue, id: number) => {
    const { title, description, type, status } = payload;

    const result = await pool.query(
        `
        INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1,$2,$3,  COALESCE($4,'open'), $5) RETURNING *
        `,
        [title, description, type, status, id],
    );

    return result;
};

const getAllIssues = async (
    sort: string,
    type: string,
    status: string,
    res: Response,
) => {
    let issueQuery = `
      SELECT *
      FROM issues
    `;

    const conditions: string[] = [];
    const values: any[] = [];
    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        issueQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sort === "oldest") {
        issueQuery += ` ORDER BY created_at ASC`;
    } else {
        issueQuery += ` ORDER BY created_at DESC`;
    }

    const issueResult = await pool.query(issueQuery, values);

    const issues = issueResult.rows;

    if (issues.length === 0) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "No issue found",
        });
    }

    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

    let reportersMap: Record<number, any> = {};

    if (reporterIds.length > 0) {
        const userResult = await pool.query(
            `
        SELECT id, name, role
        FROM users
        WHERE id = ANY($1)
        `,
            [reporterIds],
        );

        reportersMap = userResult.rows.reduce(
            (acc, user) => {
                acc[user.id] = user;
                return acc;
            },
            {} as Record<number, any>,
        );
    }

    const formattedIssues = issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: reportersMap[issue.reporter_id] || null,

        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));

    return formattedIssues;
};

const getSingleIssue = async (id: number, res: Response) => {
    const result = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id =$1  
        `,
        [id],
    );

    if (result.rows.length === 0) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Issue not found",
        });
    }

    const userResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [result.rows[0].reporter_id],
    );

    const issue = result.rows[0];

    const formattedIssue = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userResult.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };

    return formattedIssue;
};

export const issueService = {
    createIssueIntoDB,
    getAllIssues,
    getSingleIssue,
};
