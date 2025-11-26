import fs from "fs/promises"; //File system to perfom file i/o operations
import path from "path"; //It is gng to give us the path to the current directory

export async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".codebase");
  // The process.cwd() method returns the current working directory of the Node.js process
  const commitsPath = path.join(repoPath, "Commits");
  // It joins the paths of repo file to the commits

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "process.env.S3_BUCKET" })
    );

    console.log("Repository Initialized");
  } catch (err) {
    console.error("Error initializing the repository", err);
  }

  console.log("Init repo was called");
}
