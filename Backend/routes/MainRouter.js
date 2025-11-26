import express from "express";
import userRouter from "./userRouter.js";
import repoRouter from "./repoRouter.js";
import issueRouter from "./issueRouter.js";

const router = express.Router();

router.use(userRouter);
router.use(repoRouter);
router.use(issueRouter);

router.get("/", (req, res) => {
  res.send("Hello!");
});

export default router;