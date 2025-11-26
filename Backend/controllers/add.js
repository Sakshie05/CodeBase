import fs from "fs/promises";
import path from "path";

export async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".codebase");
  const addPath = path.join(repoPath, "Staging");

  try {
    await fs.mkdir(addPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(addPath, fileName));

    console.log(`File ${fileName} has been added to the staging area`);
  } catch (err) {
    console.error("Error staging the file", err);
  }

  console.log("Add repo comand was called");
}
