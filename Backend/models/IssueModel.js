import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository",
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Issue", IssueSchema);
