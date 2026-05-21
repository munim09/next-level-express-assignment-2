import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types/indesx";
import sendResponse from "../utils/sendResponse";

const auth = (...roles: ROLES[]) => {
    console.log(roles);
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("This is protected route");
            console.log(req.headers.authorization);
            const token = req.headers.authorization;

            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorize access",
                });
            }

            const decoded = jwt.verify(
                token as string,
                config.jwt_secret,
            ) as JwtPayload;
            console.log("decode", decoded);

            const userData = await pool.query(
                `
                 SELECT * FROM users WHERE email=$1   
                `,
                [decoded.email],
            );

            // console.log(userData);

            const user = userData.rows[0];

            console.log(user);

            if (userData.rows.length === 0) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "User not found",
                });
            }

            if (!user?.is_active) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Forbidden!!",
                });
            }

            if (roles.length && !roles.includes(user.role)) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Forbidden!!,This role have no access!",
                });
            }

            req.user = decoded;
            next();
        } catch (error: any) {
            next(error);
        }
    };
};

export default auth;
