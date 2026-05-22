import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types/indesx";
import { issueController } from "./issue.controller";

const router = Router();

router.post(
    "/",
    auth(USER_ROLE.contributor, USER_ROLE.maintainer),
    issueController.createIssue,
);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssues);
router.patch(
    "/:id",
    auth(USER_ROLE.contributor, USER_ROLE.maintainer),
    issueController.updateIssue,
);

router.delete("/:id", auth(USER_ROLE.maintainer), issueController.deleteIssue);

export const issueRoute = router;
