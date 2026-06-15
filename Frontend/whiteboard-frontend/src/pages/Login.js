import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 text-white">
        <h2 className="text-3xl font-bold text-center">Welcome Back!</h2>
        <p className="text-sm text-center text-gray-300">
          Login to CollabSpace 
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-2 rounded text-center border border-red-400/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;