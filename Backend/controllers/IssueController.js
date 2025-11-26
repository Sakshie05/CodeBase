import mongoose from "mongoose";
import Repository from "../models/RepoModel.js";
import Issue from "../models/IssueModel.js";

export const createIssue = async (req, res) => {
  const { title, description, repository } = req.body; 

  try {
    if (!title) {
      return res.status(400).json({ message: "Issue title is required" });
    }

    if (!repository) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const newIssue = new Issue({
      title,
      description: description || "",
      repository: repository,
    });
    
    const result = await newIssue.save();

    await Repository.findByIdAndUpdate(
      repository,
      { $push: { issues: result._id } }
    );

    res.status(201).json({
      message: "New Issue Created",
      result,
    });
  } catch (err) {
    console.error("Error in createIssue:", err);
    res.status(500).json({ message: err.message || "Error creating the issue" });
  }
};

export const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;

    await issue.save();

    res.json(issue);
  } catch (err) {
    console.error("Error in updateIssueById:", err);
    res.status(500).json({ message: err.message || "Error updating the issue" });
  }
};

export const deleteIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    
    await Repository.findByIdAndUpdate(
      issue.repository,
      { $pull: { issues: id } }
    );

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Error in deleteIssueById:", err);
    res.status(500).json({ message: err.message || "Error deleting the issue" });
  }
};

export const getAllIssues = async (req, res) => {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });
    
    if (!issues || issues.length == 0) {
      return res.status(404).json({ message: "No issues found" });
    }
    
    return res.json(issues);
  } catch (err) {
    console.error("Error in getAllIssues:", err);
    res.status(500).json({ message: "Error fetching all the issues" });
  }
};

export const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues || issues.length === 0) {
      return res.status(404).json({ message: "No issues found" });
    }

    res.json(issues);
  } catch (err) {
    console.error("Error in getIssueById:", err);
    return res.status(500).json({ message: err.message || "Error finding the issue" });
  }
};