import express, {
    type Application,
    type Request,
    type Response,
} from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import globalErrorHandler from "./middleware/glonaErrorHandler";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";

const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(
    cors({
        origin: "http://localhost:5000",
    }),
);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Express server",
        author: "Next level",
    });

    // res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);
export default app;
