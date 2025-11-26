import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepos, setSuggestedRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");

    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/repo/user/${userId}`
        );
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setRepositories(data);
        } else {
          console.error(data);
          setRepositories([]);
        }
      } catch (err) {
        console.error("Error fetching repositories", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepos = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/allRepos`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSuggestedRepos(data);
          setFilteredRepos(data);
        } else {
          console.error(data);
          setSuggestedRepos([]);
          setFilteredRepos([]);
        }
      } catch (err) {
        console.error("Error fetching suggested repositories", err);
        setSuggestedRepos([]);
        setFilteredRepos([]);
      }
    };

    if (userId) {
      fetchRepos();
    }

    fetchSuggestedRepos();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRepos(suggestedRepos);
    } else {
      const filtered = suggestedRepos.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRepos(filtered);
    }
  }, [searchQuery, suggestedRepos]);

  const handleViewRepo = (repoId) => {
    navigate(`/repo/${repoId}`);
  };

  const goToProfile = () => {
    navigate("/profile");
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
            <span className="text-white text-xl font-semibold">{username}</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[#c9d1d9] hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z"></path>
              </svg>
            </button>
            <button className="text-[#c9d1d9] hover:text-white text-xl">+</button>
            <div 
              className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-purple-700"
              onClick={goToProfile}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold">Recent</h3>
              <button 
                className="text-[#58a6ff] hover:underline text-sm"
                onClick={() => navigate("/create-repository")}
              >
                New
              </button>
            </div>
            <div className="space-y-1">
              {repositories.slice(0, 6).map((repo) => (
                <div
                  key={repo._id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[#161b22] cursor-pointer"
                  onClick={() => handleViewRepo(repo._id)}
                >
                  <svg
                    className="w-4 h-4 text-[#8b949e]"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                  <span className="text-[#c9d1d9] text-sm truncate">{repo.name}</span>
                </div>
              ))}
              {repositories.length === 0 && (
                <p className="text-[#8b949e] text-sm px-3 py-2">No repositories yet</p>
              )}
            </div>
          </aside>

          <main className="col-span-6">
            <h2 className="text-white text-2xl font-semibold mb-6">Home</h2>

            <div className="space-y-4">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <div
                    key={repo._id}
                    className="bg-[#161b22] border border-[#30363d] rounded-md p-4"
                  >
                    <h3 className="text-[#58a6ff] text-lg font-semibold mb-2">
                      {repo.name}
                    </h3>
                    <p className="text-[#8b949e] text-sm mb-3">
                      {repo.description || "No description available"}
                    </p>
                    <button 
                      className="text-[#58a6ff] text-sm hover:underline"
                      onClick={() => handleViewRepo(repo._id)}
                    >
                      VIEW REPOSITORY
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-[#161b22] border border-[#30363d] rounded-md p-8 text-center">
                  <p className="text-[#8b949e]">No repositories found</p>
                </div>
              )}
            </div>
          </main>

          <aside className="col-span-3 space-y-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
              <h3 className="text-white text-lg font-semibold mb-3">
                GitHub Trending
              </h3>
              <button className="text-[#58a6ff] text-sm hover:underline">
                VIEW TRENDING
              </button>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
              <h3 className="text-white text-lg font-semibold mb-3">
                GitHub Trending
              </h3>
              <button className="text-[#58a6ff] text-sm hover:underline">
                VIEW TRENDING
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;