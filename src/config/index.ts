import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

const config = {
    connection_string: process.env.CONNECTIONSTRING as string,
    port: Number(process.env.PORT),
    salt: Number(process.env.SALT),
    jwt_secret: String(process.env.JWT_SECRET),
    jwt_reresh_secret: process.env.JWT_REFRESH_SECRET as string,
};

export default config;
