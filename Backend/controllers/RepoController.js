import mongoose from "mongoose";
import Repository from "../models/RepoModel.js";
import User from "../models/UserModel.js";
import fs from "fs";

export const createRepository = async (req, res) => {
  const { name, description, visibility, owner } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res
        .status(400)
        .json({ message: "User not found or invalid userId" });
    }

    let content = [];
    if (req.files && req.files.length > 0) {
      content = req.files.map((file) => {
        let fileContent = "";
        try {
          const textExtensions = [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".html",
            ".css",
            ".json",
            ".md",
            ".txt",
            ".py",
            ".java",
            ".cpp",
            ".c",
          ];
          const isTextFile = textExtensions.some((ext) =>
            file.originalname.toLowerCase().endsWith(ext)
          );

          if (isTextFile) {
            fileContent = fs.readFileSync(file.path, "utf-8");
          } else {
            fileContent = `Binary file: ${file.originalname}`;
          }
        } catch (readError) {
          console.error("Error reading file:", readError);
          fileContent = `Error reading file: ${file.originalname}`;
        }

        return {
          name: file.originalname,
          content: fileContent,
          size: file.size,
          mimetype: file.mimetype,
        };
      });
    }

    const newRepo = new Repository({
      name,
      description: description || "",
      content,
      visibility: visibility === "true" || visibility === true,
      owner,
      issues: [],
    });

    const result = await newRepo.save();

    if (req.files) {
      req.files.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      });
    }

    res.status(201).json({
      message: "New Repository Created",
      repoId: result._id,
      repoName: result.name,
    });
  } catch (err) {
    console.error("Error in createRepository:", err);
    res
      .status(500)
      .json({ message: err.message || "Error creating a new repository" });
  }
};

export const getAllRepos = async (req, res) => {
  try {
    const repos = await Repository.find({}).populate("owner", "username email"); 

    return res.json(repos);
  } catch (err) {
    console.error("Error in getAllRepos:", err);
    res
      .status(500)
      .json({ message: err.message || "Error fetching all the repositories" });
  }
};

export const getRepoById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repository.findById(id).populate(
      "owner",
      "username email"
    ); 

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo);
  } catch (err) {
    console.error("Error in getRepoById:", err);
    res
      .status(500)
      .json({ message: err.message || "Error fetching the repository" });
  }
};

export const getRepoByName = async (req, res) => {
  const { name } = req.params;

  try {
    const repo = await Repository.findOne({ name: name }); 

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo);
  } catch (err) {
    console.error("Error in getRepoByName:", err);
    res.status(500).json({ message: "Error fetching the repository" });
  }
};

export const fetchReposByCurrentUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const repos = await Repository.find({ owner: userId }).populate(
      "owner",
      "username email"
    ); 

    if (!repos || repos.length == 0) {
      return res.status(404).json({ message: "User repositories not found" });
    }

    res.json(repos);
  } catch (err) {
    console.error("Error in fetchReposByCurrentUser:", err);
    res
      .status(500)
      .json({
        message: err.message || "Unable to fetch the repositories of the user",
      });
  }
};

export const updateRepoById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (content) {
      if (!Array.isArray(repo.content)) repo.content = [];
      repo.content.push(content);
    }

    if (description) {
      repo.description = description;
    }

    const updatedRepo = await repo.save();

    res.json({
      message: "Repository updated successfully",
      repo: updatedRepo,
    });
  } catch (err) {
    console.error("Error in updateRepoById:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to update the repository" });
  }
};

export const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;

    const updatedRepo = await repo.save();

    res.json({
      message: "Repository visibility toggled successfully",
      repo: updatedRepo,
    });
  } catch (err) {
    console.error("Error in toggleVisibilityById:", err);
    res
      .status(500)
      .json({ message: err.message || "Error in toggling the visibility" });
  }
};

export const deleteRepoById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repository.findByIdAndDelete(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error in deleteRepoById:", err);
    res
      .status(500)
      .json({ message: err.message || "Error deleting the repository" });
  }
};

export const starRepository = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (!Array.isArray(repo.stars)) {
      repo.stars = [];
    }

    const alreadyStarred = repo.stars.some(
      (star) => star.toString() === userId
    );

    if (alreadyStarred) {
      repo.stars = repo.stars.filter((star) => star.toString() !== userId);
      await repo.save();
      return res.json({
        message: "Repository unstarred",
        starred: false,
        starCount: repo.stars.length,
      });
    } else {
      repo.stars.push(userId);
      await repo.save();
      return res.json({
        message: "Repository starred",
        starred: true,
        starCount: repo.stars.length,
      });
    }
  } catch (err) {
    console.error("Error in starRepository:", err);
    res
      .status(500)
      .json({ message: err.message || "Error starring repository" });
  }
};

export const forkRepository = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const originalRepo = await Repository.findById(id);

    if (!originalRepo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const user = await User.findById(userId);
    const username = user?.username || "user";

    const existingFork = await Repository.findOne({
      owner: userId,
      forkedFrom: id,
    });

    if (existingFork) {
      return res.status(400).json({
        message: "You have already forked this repository",
        repoId: existingFork._id,
      });
    }

    // Creating a unique name for forked repo
    const forkedName = `${originalRepo.name}-fork-${Date.now()}`;

    const forkedRepo = new Repository({
      name: forkedName, 
      description: originalRepo.description
        ? `${originalRepo.description} (Forked from ${originalRepo.name})`
        : `Forked from ${originalRepo.name}`,
      content: originalRepo.content || [],
      visibility: originalRepo.visibility,
      owner: userId,
      issues: [],
      stars: [],
      forks: [],
      forkedFrom: id,
    });

    const savedFork = await forkedRepo.save();

    if (!Array.isArray(originalRepo.forks)) {
      originalRepo.forks = [];
    }
    originalRepo.forks.push(savedFork._id);
    await originalRepo.save();

    res.status(201).json({
      message: "Repository forked successfully",
      repoId: savedFork._id,
      repoName: savedFork.name,
    });
  } catch (err) {
    console.error("Error in forkRepository:", err);
    res
      .status(500)
      .json({ message: err.message || "Error forking repository" });
  }
};


export const getStarredRepos = async (req, res) => {
  const { userId } = req.params;

  try {
    const repos = await Repository.find({ stars: userId }).populate(
      "owner",
      "username email"
    ); 
    res.json(repos);
  } catch (err) {
    console.error("Error in getStarredRepos:", err);
    res
      .status(500)
      .json({ message: err.message || "Error fetching starred repositories" });
  }
};
