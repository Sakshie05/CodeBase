import fs from "fs/promises";
import path from "path";
// import { s3, S3_BUCKET } from "../config/AWSconfig.js";

export async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".codebase");
  const commitsPath = path.join(repoPath, "Commits");

  try {
    // const commitDirs = await fs.readdir(commitsPath);

    // for (const commitDir of commitDirs) {
    //   const commitPath = path.join(commitsPath, commitDir);
    //   const files = await fs.readdir(commitPath);

    //   for (const file of files) {
    //     const filePath = path.join(commitPath, file);
    //     const fileContent = await fs.readFile(filePath);

    //     const params = {
    //       Bucket: S3_BUCKET,
    //       Key: `commits/${commitDir}/${file}`,
    //       Body: fileContent,
    //     };

    //     await s3.upload(params).promise;
    //   }
    // }

    console.log("All commits pushed to S3");
  } catch (err) {
    console.log("Error pushing into AWS", err);
  }
}
