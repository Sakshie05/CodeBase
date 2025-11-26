import fs from "fs/promises";
import path from "path";
// import { s3, S3_BUCKET } from "../config/AWSconfig.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), "./codebase");
  const commitsPath = path.join(repoPath, "Commits");

  try {
    // We need to first fetch the data from the bucket
    // const data = await s3
    //   .listObjectsV2({
    //     Bucket: S3_BUCKET,
    //     Prefix: "Commits/",
    //   })
    //   .promise();

    // const objects = data.Contents;

    // for (const object of objects) {
    //   const key = object.Key;
    //   const commitDir = path.join(
    //     commitsPath,
    //     path.dirname(key).split("/").pop()
    //   );

    //   await fs.mkdir(commitDir, { recursive: true });

    //   const params = {
    //     Bucket: S3_BUCKET,
    //     Key: key,
    //   };

    //   const fileContent = await s3.getObject(params).promise();

    //   await fs.writeFile(path.join(repoPath, key), fileContent.Body);

      console.log("All the commits are pulled from S3");
    }
   catch (err) {
    console.log("Unable to pull", err);
  }
}
