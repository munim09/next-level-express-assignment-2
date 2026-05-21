import bcrypt from "bcryptjs";
import { pool } from "../../db";

import jwt from "jsonwebtoken";
import config from "../../config";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, role } = payload;

    const hashPassword = await bcrypt.hash(password, config.salt);
    // const result = await pool.query(
    //     `
    //     INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING name, email, age, created_at, updated_at
    //     `,
    //     [name, email, hashPassword, age],
    // );

    const result = await pool.query(
        `
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,  COALESCE($4,'contributor')) RETURNING *
        `,
        [name, email, hashPassword, role],
    );

    delete result.rows[0].password;

    return result;
};

const loginUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
    const { email, password } = payload;
    // 1. Check if the user exists -> Done
    // 2. Compare the password -> Done
    //3. Generate Token -> Done

    // 1. Check if the user exists
    const userData = await pool.query(`select * from users where email=$1`, [
        email,
    ]);

    if (userData.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = userData.rows[0];
    console.log("user", user);

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) throw new Error("Invalid credential");

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };
    const token = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: "30m", // 10m, 2h, 1d,
    });

    delete user.password;

    return { token, user };
};

export const authService = {
    createUserIntoDB,
    loginUserIntoDB,
};
