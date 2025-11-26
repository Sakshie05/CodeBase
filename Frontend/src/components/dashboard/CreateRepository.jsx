import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRepository = () => {
  const [repoData, setRepoData] = useState({
    name: "",
    description: "",
    visibility: true
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
  const userId = localStorage.getItem("userId");

  if (!repoData.name) {
    alert("Repository name is required!");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", repoData.name);
    formData.append("description", repoData.description);
    formData.append("visibility", repoData.visibility);
    formData.append("owner", userId);

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    console.log("Sending FormData:", {
      name: repoData.name,
      description: repoData.description,
      visibility: repoData.visibility,
      owner: userId,
      filesCount: selectedFiles.length
    });

    const response = await fetch("http://localhost:8000/repo/create", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const stored = localStorage.getItem("activityHeatmap");
      const activityData = stored ? JSON.parse(stored) : {};
      activityData[dateStr] = (activityData[dateStr] || 0) + 1;
      localStorage.setItem("activityHeatmap", JSON.stringify(activityData));

      alert("Repository created successfully!");
      navigate(`/repo/${data.repoId}`);
    } else {
      console.error("Error response:", data);
      alert(data.message || "Failed to create repository");
      setLoading(false);
    }
  } catch (err) {
    console.error("Error creating repository:", err);
    alert("Error creating repository: " + err.message);
    setLoading(false);
  }
};

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
            <span className="text-white text-xl font-semibold">Create New Repository</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-[#c9d1d9] hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
            <h2 className="text-white text-xl font-semibold mb-4">Repository Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Repository Name *
                </label>
                <input
                  type="text"
                  value={repoData.name}
                  onChange={(e) => setRepoData({ ...repoData, name: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
                  placeholder="my-awesome-project"
                />
              </div>

              <div>
                <label className="block text-[#c9d1d9] text-sm font-normal mb-2">
                  Description
                </label>
                <textarea
                  value={repoData.description}
                  onChange={(e) => setRepoData({ ...repoData, description: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff] min-h-[100px]"
                  placeholder="A brief description of your project"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={repoData.visibility}
                  onChange={(e) => setRepoData({ ...repoData, visibility: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="visibility" className="text-[#c9d1d9] text-sm">
                  Public repository
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">Upload Files</h2>
              <label className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer">
                + Add Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.py,.java,.cpp,.c,.pdf,.png,.jpg,.jpeg,.gif"
                />
              </label>
            </div>

            <div className="space-y-3">
              {selectedFiles.length > 0 ? (
                selectedFiles.map((file, index) => (
                  <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <svg className="w-5 h-5 text-[#8b949e]" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#c9d1d9] text-sm truncate">{file.name}</p>
                          <p className="text-[#8b949e] text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-[#f85149] hover:text-[#ff7b72] text-sm ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-[#30363d] rounded-md">
                  <svg className="w-12 h-12 text-[#8b949e] mx-auto mb-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11Zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7ZM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7Zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13Z"></path>
                  </svg>
                  <p className="text-[#8b949e] text-sm mb-2">No files selected</p>
                  <p className="text-[#8b949e] text-xs">Click "Add Files" to upload</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-[#8b949e] text-white font-medium py-3 px-4 rounded-md text-sm transition-colors duration-200"
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-3 rounded-md text-sm transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;