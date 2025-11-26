import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]); // Add this
  const [activityData, setActivityData] = useState({});
  const [stats, setStats] = useState({
    totalRepos: 0,
    publicRepos: 0,
    privateRepos: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    setUser({ username: username || "User", email: email || "" });

    const fetchRepos = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/user/${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setRepositories(data);
          
          setStats({
            totalRepos: data.length,
            publicRepos: data.filter(r => r.visibility).length,
            privateRepos: data.filter(r => !r.visibility).length
          });
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };

    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(`http://localhost:8000/repo/starred/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setStarredRepos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching starred repositories:", err);
      }
    };

    const loadActivityData = () => {
      const stored = localStorage.getItem("activityHeatmap");
      if (stored) {
        setActivityData(JSON.parse(stored));
      }
    };

    if (userId) {
      fetchRepos();
      fetchStarredRepos(); 
      loadActivityData();
    }
  }, []);


  const generateHeatmapData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      
      const days = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const count = activityData[dateStr] || 0;
        days.push({ date: dateStr, count, day });
      }
      
      months.push({ month: monthName, year, days });
    }
    
    return months;
  };

  const getActivityColor = (count) => {
    if (count === 0) return '#161b22';
    if (count === 1) return '#0e4429';
    if (count <= 3) return '#006d32';
    if (count <= 5) return '#26a641';
    return '#39d353';
  };

  const heatmapMonths = generateHeatmapData();
  const totalContributions = Object.values(activityData).reduce((sum, count) => sum + count, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
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
            <button
              onClick={() => navigate("/")}
              className="text-[#58a6ff] hover:underline text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#c9d1d9] hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex items-start gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-white text-5xl font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-3xl font-bold mb-2">
              {user?.username || "User"}
            </h1>
            {user?.email && (
              <p className="text-[#8b949e] text-base mb-4">{user.email}</p>
            )}
            <div className="flex gap-4">
              <div className="text-[#c9d1d9]">
                <span className="font-semibold">{stats.totalRepos}</span>
                <span className="text-[#8b949e] ml-1">repositories</span>
              </div>
              <div className="text-[#c9d1d9]">
                <span className="font-semibold">{stats.publicRepos}</span>
                <span className="text-[#8b949e] ml-1">public</span>
              </div>
              <div className="text-[#c9d1d9]">
                <span className="font-semibold">{stats.privateRepos}</span>
                <span className="text-[#8b949e] ml-1">private</span>
              </div>
              <div className="text-[#c9d1d9]">
                <span className="font-semibold">{starredRepos.length}</span>
                <span className="text-[#8b949e] ml-1">starred</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">
              {totalContributions} contributions in the last year
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#161b22'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#0e4429'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#006d32'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#26a641'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#39d353'}}></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-1">
              {heatmapMonths.map((month, idx) => (
                <div key={idx} className="flex flex-col gap-1 min-w-[80px]">
                  <div className="text-[#8b949e] text-xs mb-1 h-4">
                    {month.month}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {month.days.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-white"
                        style={{ backgroundColor: getActivityColor(day.count) }}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Popular repositories
          </h2>
          {repositories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {repositories.slice(0, 6).map((repo) => (
                <div
                  key={repo._id}
                  className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 hover:border-[#58a6ff] cursor-pointer transition-colors"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-[#8b949e]"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <h3 className="text-[#58a6ff] font-semibold">{repo.name}</h3>
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full border ${
                      repo.visibility 
                        ? "border-[#30363d] text-[#8b949e]" 
                        : "border-[#f85149] text-[#f85149]"
                    }`}>
                      {repo.visibility ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-[#8b949e] text-sm line-clamp-2">
                    {repo.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#8b949e] mb-4">No repositories yet</p>
              <button
                onClick={() => navigate("/")}
                className="text-[#58a6ff] hover:underline"
              >
                Create your first repository
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
            <h2 className="text-white text-xl font-semibold">
              Starred repositories ({starredRepos.length})
            </h2>
          </div>
          {starredRepos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {starredRepos.map((repo) => (
                <div
                  key={repo._id}
                  className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 hover:border-[#58a6ff] cursor-pointer transition-colors"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-[#8b949e]"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <h3 className="text-[#58a6ff] font-semibold">{repo.name}</h3>
                    <svg className="w-4 h-4 text-yellow-400 fill-current ml-auto" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                  </div>
                  <p className="text-[#8b949e] text-sm line-clamp-2">
                    {repo.description || "No description"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#8b949e]">
                    {repo.stars && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                        </svg>
                        <span>{repo.stars.length}</span>
                      </div>
                    )}
                    {repo.forks && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0Z"></path>
                        </svg>
                        <span>{repo.forks.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#8b949e] mb-4">No starred repositories yet</p>
              <button
                onClick={() => navigate("/")}
                className="text-[#58a6ff] hover:underline"
              >
                Explore repositories
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;