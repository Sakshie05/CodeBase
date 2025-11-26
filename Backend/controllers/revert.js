import fs from "fs";
import path from "path";
import { promisify } from "util";
// import { s3, S3_BUCKET } from "../config/AWSconfig.js";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd, ".codebase");
  const commitsPath = path.join(repoPath, "Commits");

  try {
    // const commitDir = path.join(commitsPath, commitID);
    // const files = await readdir(commitDir);
    // const parentDir = path.resolve(repoPath, "..");

    // for (const file of files) {
    //   await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    // }

    console.log(`Commit ${commitID} reverted to successfully`);
  } catch (err) {
    console.log("Unable to revert to the repo", err);
  }
}
