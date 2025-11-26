import express from "express";
import {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
} from "../controllers/IssueController.js";

const issueRouter = express.Router();

issueRouter.post("/issue/create", createIssue);
issueRouter.put("/issue/update/:id", updateIssueById);
issueRouter.delete("/issue/delete/:id", deleteIssueById);
issueRouter.get("/issue/all/:id", getAllIssues); 
issueRouter.get("/issue/:id", getIssueById); 

export default issueRouter;