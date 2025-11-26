import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RepositoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
  });

  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [forkCount, setForkCount] = useState(0);
  const [showEditIssueModal, setShowEditIssueModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);

  useEffect(() => {
    fetchRepo();
    fetchIssues();
    checkIfStarred();
  }, [id]);

  const checkIfStarred = async () => {
    try {
      const response = await fetch(`http://localhost:8000/repo/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch repository");
      }

      const data = await response.json();
      const repoData = Array.isArray(data) ? data[0] : data;

      const userId = localStorage.getItem("userId");

      const starred =
        Array.isArray(repoData.stars) && repoData.stars.includes(userId);

      setIsStarred(starred);
      setStarCount(Array.isArray(repoData.stars) ? repoData.stars.length : 0);
      setForkCount(Array.isArray(repoData.forks) ? repoData.forks.length : 0);
    } catch (err) {
      console.error("Error checking star status:", err);
      setIsStarred(false);
      setStarCount(0);
      setForkCount(0);
    }
  };
  const handleStar = async () => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`http://localhost:8000/repo/star/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsStarred(data.starred);
        setStarCount(data.starCount);
        trackActivity();
        alert(data.message);
      } else {
        alert("Failed to star repository");
      }
    } catch (err) {
      console.error("Error starring repository:", err);
      alert("Error starring repository");
    }
  };

  const handleFork = async () => {
    const userId = localStorage.getItem("userId");

    if (isOwner) {
      alert("You cannot fork your own repository!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/repo/fork/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        trackActivity();
        alert(data.message);
        navigate(`/repo/${data.repoId}`);
      } else {
        alert(data.message || "Failed to fork repository");
      }
    } catch (err) {
      console.error("Error forking repository:", err);
      alert("Error forking repository");
    }
  };

  const fetchRepo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/repo/${id}`);

      if (!response.ok) {
        throw new Error("Repository not found");
      }

      const data = await response.json();
      console.log("Fetched repo:", data);
      const repoData = Array.isArray(data) ? data[0] : data;
      setRepo(repoData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await fetch(`http://localhost:8000/issue/${id}`);

      if (response.ok) {
        const data = await response.json();
        setIssues(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        setIssues([]);
      } else {
        console.error("Error fetching issues");
        setIssues([]);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setIssues([]);
    }
  };

  const trackActivity = () => {
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const stored = localStorage.getItem("activityHeatmap");
      const activityData = stored ? JSON.parse(stored) : {};
      activityData[dateStr] = (activityData[dateStr] || 0) + 1;
      localStorage.setItem("activityHeatmap", JSON.stringify(activityData));
    } catch (error) {
      console.error("Error tracking activity:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/repo/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        trackActivity();
        alert("Repository deleted successfully!");
        navigate("/");
      } else {
        alert("Failed to delete repository");
      }
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("Error deleting repository");
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await fetch(`http://localhost:8000/repo/toggle/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        const data = await response.json();
        setRepo(data.repo);
        trackActivity();
        alert("Visibility toggled successfully!");
      } else {
        alert("Failed to toggle visibility");
      }
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Error toggling visibility");
    }
  };

  const handleCreateIssue = async () => {
    if (!newIssue.title) {
      alert("Issue title is required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/issue/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newIssue.title,
          description: newIssue.description,
          repository: id,
        }),
      });

      if (response.ok) {
        trackActivity();
        alert("Issue created successfully!");
        setShowIssueModal(false);
        setNewIssue({ title: "", description: "" });
        fetchIssues();
      } else {
        alert("Failed to create issue");
      }
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Error creating issue");
    }
  };

  const handleEditIssue = (issue) => {
    setEditingIssue(issue);
    setShowEditIssueModal(true);
  };

  const handleUpdateIssue = async () => {
    if (!editingIssue.title) {
      alert("Issue title is required!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/issue/update/${editingIssue._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingIssue.title,
            description: editingIssue.description,
            status: editingIssue.status,
          }),
        }
      );

      if (response.ok) {
        trackActivity();
        alert("Issue updated successfully!");
        setShowEditIssueModal(false);
        setEditingIssue(null);
        fetchIssues();
      } else {
        alert("Failed to update issue");
      }
    } catch (err) {
      console.error("Error updating issue:", err);
      alert("Error updating issue");
    }
  };

  const handleToggleIssueStatus = async (issue) => {
    const newStatus = issue.status === "open" ? "closed" : "open";

    try {
      const response = await fetch(
        `http://localhost:8000/issue/update/${issue._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: issue.title,
            description: issue.description,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        trackActivity();
        fetchIssues();
      } else {
        alert("Failed to toggle issue status");
      }
    } catch (err) {
      console.error("Error toggling issue status:", err);
      alert("Error toggling issue status");
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/issue/delete/${issueId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        trackActivity();
        alert("Issue deleted successfully!");
        fetchIssues();
      } else {
        alert("Failed to delete issue");
      }
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert("Error deleting issue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#c9d1d9] text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Repository Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="text-[#58a6ff] hover:underline"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const userId = localStorage.getItem("userId");

  const ownerId = typeof repo.owner === "object" ? repo.owner?._id : repo.owner;
  const isOwner = ownerId === userId;

  const ownerName =
    typeof repo.owner === "object"
      ? repo.owner?.username || repo.owner?.email || "Unknown"
      : "Unknown";

  console.log("Owner check:", { ownerId, userId, isOwner }); // Debug log

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <nav className="bg-[#161b22] border-b border-[#30363d] px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg
              height="32"
              viewBox="0 0 16 16"
              width="32"
              className="fill-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            <button
              onClick={() => navigate("/")}
              className="text-[#58a6ff] hover:underline text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#8b949e]"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
              </svg>
              <h1 className="text-[#58a6ff] text-2xl font-semibold">
                {ownerName} / {repo.name}
              </h1>
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  repo.visibility
                    ? "border-[#30363d] text-[#8b949e]"
                    : "border-[#f85149] text-[#f85149]"
                }`}
              >
                {repo.visibility ? "Public" : "Private"}
              </span>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={handleToggleVisibility}
                  className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md text-sm border border-[#30363d] transition-colors"
                >
                  Toggle Visibility
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-[#21262d] hover:bg-[#da3633] text-[#c9d1d9] hover:text-white px-3 py-1.5 rounded-md text-sm border border-[#30363d] hover:border-[#da3633] transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {repo.description && (
            <p className="text-[#c9d1d9] text-base mb-4">{repo.description}</p>
          )}

          <div className="flex gap-4 mb-6 pb-6 border-b border-[#30363d]">
            <button
              onClick={handleStar}
              className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-3 py-1.5 rounded-md text-sm border border-[#30363d] transition-colors"
            >
              <svg
                className={`w-4 h-4 ${
                  isStarred ? "fill-yellow-400" : "fill-none"
                } stroke-current`}
                viewBox="0 0 16 16"
              >
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
              <span>{isStarred ? "Starred" : "Star"}</span>
              <span className="bg-[#30363d] px-2 py-0.5 rounded-full text-xs">
                {starCount}
              </span>
            </button>

            <button
              onClick={handleFork}
              disabled={isOwner}
              className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed text-[#c9d1d9] px-3 py-1.5 rounded-md text-sm border border-[#30363d] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
              </svg>
              <span>Fork</span>
              <span className="bg-[#30363d] px-2 py-0.5 rounded-full text-xs">
                {forkCount}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[#30363d]">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "text-white border-b-2 border-[#f78166]"
                  : "text-[#8b949e] hover:text-[#c9d1d9]"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25Zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25Z"></path>
                </svg>
                Code
              </div>
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "issues"
                  ? "text-white border-b-2 border-[#f78166]"
                  : "text-[#8b949e] hover:text-[#c9d1d9]"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                </svg>
                Issues
                <span className="bg-[#30363d] text-[#c9d1d9] px-2 py-0.5 rounded-full text-xs">
                  {issues.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "code" ? (
          <div className="bg-[#161b22] border border-[#30363d] rounded-md">
            <div className="border-b border-[#30363d] px-4 py-3">
              <h2 className="text-white text-lg font-semibold">Files</h2>
            </div>
            <div className="p-4">
              {repo.content &&
              Array.isArray(repo.content) &&
              repo.content.length > 0 ? (
                <div className="space-y-3">
                  {repo.content.map((file, index) => (
                    <div
                      key={index}
                      className="bg-[#0d1117] border border-[#30363d] rounded-md p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-[#8b949e]"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                        </svg>
                        <h3 className="text-[#c9d1d9] font-semibold">
                          {file.name}
                        </h3>
                        {file.size && (
                          <span className="text-[#8b949e] text-xs ml-auto">
                            {(file.size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                      <pre className="text-[#8b949e] text-sm font-mono whitespace-pre-wrap bg-[#161b22] p-3 rounded border border-[#30363d] overflow-x-auto">
                        {file.content}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#8b949e] text-sm">
                    No files in this repository
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">Issues</h2>
              <button
                onClick={() => setShowIssueModal(true)}
                className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                New Issue
              </button>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-md">
              {issues.length > 0 ? (
                <div className="divide-y divide-[#30363d]">
                  {issues.map((issue) => (
                    <div
                      key={issue._id}
                      className="p-4 hover:bg-[#0d1117] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className={`w-4 h-4 ${
                                issue.status === "open"
                                  ? "text-[#3fb950]"
                                  : "text-[#8957e5]"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              {issue.status === "open" ? (
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                              ) : (
                                <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
                              )}
                            </svg>
                            <h3 className="text-[#c9d1d9] font-semibold">
                              {issue.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                issue.status === "open"
                                  ? "bg-[#3fb950]/10 text-[#3fb950] border border-[#3fb950]/30"
                                  : "bg-[#8957e5]/10 text-[#8957e5] border border-[#8957e5]/30"
                              }`}
                            >
                              {issue.status}
                            </span>
                          </div>
                          {issue.description && (
                            <p className="text-[#8b949e] text-sm ml-6">
                              {issue.description}
                            </p>
                          )}
                          <p className="text-[#8b949e] text-xs ml-6 mt-1">
                            {new Date(issue.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleToggleIssueStatus(issue)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              issue.status === "open"
                                ? "bg-[#8957e5]/10 text-[#8957e5] hover:bg-[#8957e5]/20 border border-[#8957e5]/30"
                                : "bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20 border border-[#3fb950]/30"
                            }`}
                            title={
                              issue.status === "open"
                                ? "Close issue"
                                : "Reopen issue"
                            }
                          >
                            {issue.status === "open" ? "Close" : "Reopen"}
                          </button>

                          <button
                            onClick={() => handleEditIssue(issue)}
                            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm"
                            title="Edit issue"
                          >
                            Edit
                          </button>

                          {isOwner && (
                            <button
                              onClick={() => handleDeleteIssue(issue._id)}
                              className="text-[#f85149] hover:text-[#ff7b72] text-sm"
                              title="Delete issue"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[#8b949e] mb-4">No issues yet</p>
                  <button
                    onClick={() => setShowIssueModal(true)}
                    className="text-[#58a6ff] hover:underline text-sm"
                  >
                    Create the first issue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-semibold mb-4">
              Delete Repository
            </h2>
            <p className="text-[#c9d1d9] mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{repo.name}</span>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#da3633] hover:bg-[#b62324] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Delete Repository
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-semibold mb-4">
              Create New Issue
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newIssue.title}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, title: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
                  placeholder="Issue title"
                />
              </div>

              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Description
                </label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, description: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] min-h-[100px]"
                  placeholder="Describe the issue..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateIssue}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Create Issue
              </button>
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  setNewIssue({ title: "", description: "" });
                }}
                className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Issue Modal */}
      {showEditIssueModal && editingIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 w-full max-w-md">
            <h2 className="text-white text-xl font-semibold mb-4">
              Edit Issue
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingIssue.title}
                  onChange={(e) =>
                    setEditingIssue({ ...editingIssue, title: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
                  placeholder="Issue title"
                />
              </div>

              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Description
                </label>
                <textarea
                  value={editingIssue.description}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] min-h-[100px]"
                  placeholder="Describe the issue..."
                />
              </div>

              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Status
                </label>
                <select
                  value={editingIssue.status}
                  onChange={(e) =>
                    setEditingIssue({ ...editingIssue, status: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateIssue}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Update Issue
              </button>
              <button
                onClick={() => {
                  setShowEditIssueModal(false);
                  setEditingIssue(null);
                }}
                className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetail;
