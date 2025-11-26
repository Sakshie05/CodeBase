import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx"

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {setCurrentUser} = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/signup", {
        email: email,
        password: password,
        username: username
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4">
    
      <div className="mb-8">
        <svg
          height="48"
          aria-hidden="true"
          viewBox="0 0 16 16"
          version="1.1"
          width="48"
          className="fill-white"
        >
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
      </div>

      <h1 className="text-white text-2xl font-light mb-6">Sign Up</h1>

      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 w-full max-w-[340px]">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-[#c9d1d9] text-sm font-normal mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[#c9d1d9] text-sm font-normal mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#c9d1d9] text-sm font-normal mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] text-sm focus:border-[#58a6ff] focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
            />
          </div>

          <button
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>
        </div>
      </div>

      <div className="mt-4 border border-[#30363d] rounded-md p-4 w-full max-w-[340px] text-center bg-[#161b22]">
        <p className="text-[#c9d1d9] text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#58a6ff] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
