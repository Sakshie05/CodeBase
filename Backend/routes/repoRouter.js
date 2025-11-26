import express from "express";
import {
  createRepository,
  getAllRepos,
  getRepoById,
  getRepoByName,
  fetchReposByCurrentUser,
  updateRepoById,
  toggleVisibilityById,
  deleteRepoById,
  starRepository,
  forkRepository,
  getStarredRepos
} from "../controllers/RepoController.js";
import upload from "../config/multerConfig.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create", upload.array("files", 10), createRepository);
repoRouter.get("/repo/allRepos", getAllRepos);
repoRouter.get("/repo/:id", getRepoById);
repoRouter.get("/repo/name/:name", getRepoByName);
repoRouter.get("/repo/user/:userId", fetchReposByCurrentUser);
repoRouter.put("/repo/update/:id", updateRepoById);
repoRouter.delete("/repo/delete/:id", deleteRepoById);
repoRouter.patch("/repo/toggle/:id", toggleVisibilityById);
repoRouter.post("/repo/star/:id", starRepository);
repoRouter.post("/repo/fork/:id", forkRepository);
repoRouter.get("/repo/starred/:userId", getStarredRepos);


export default repoRouter;
