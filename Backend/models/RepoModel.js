import mongoose from "mongoose";

const RepoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  visibility: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue"
  }],
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository"
  }],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository",
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model("Repository", RepoSchema);