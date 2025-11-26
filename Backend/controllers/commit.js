import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".codebase");
  const stagedPath = path.join(repoPath, "Staging");
  const commitPath = path.join(repoPath, "Commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    // Soo all the files present in the Staging folder are stored in stagedPath
    // In this variable files all those files are than read from readdir function

    for (const file of files) {
      await fs.copyFile(
        //The files present in the staging folder are copied into the commitDir
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }
    // path.join usually takes 2 arguments - the first one is where the file shd be present andd
    // second argument is what is the name of the file
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    // We create a file commit.json in commitDir and write into it

    console.log(`Commit ${commitID} is created with the message ${message}`);
  } catch (err) {
    console.error("Error committing the files", err);
  }
}
