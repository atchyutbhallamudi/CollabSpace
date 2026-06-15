import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Profile() {
  const [profile, setProfile] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [sharedwith, setSharedwith] = useState([]);
  const [error, setError] = useState(null);
  const [newCanvasName, setNewCanvasName] = useState("");
  const [shareByEmail, setShareByEmail] = useState("");
  const [selectedCanvasForShare, setSelectedCanvasForShare] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndCanvases = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const profileResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = await profileResponse.json();
        if (profileResponse.ok) {
          setProfile(profileData.email);
        } else {
          setError(profileData.message || "Failed to fetch profile");
          navigate("/login");
          return;
        }

        const canvasResponse = await fetch(`${API_BASE_URL}/api/canvas/list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const canvasData = await canvasResponse.json();
        if (canvasResponse.ok) {
          setCanvases(canvasData);
        } else {
          setError(canvasData.message || "Failed to fetch canvas");
          return;
        }
      } catch (err) {
        setError("An error occurred while fetching the profile");
        navigate("/login");
      }
    };
    fetchProfileAndCanvases();
    console.log("sucess getting profile and canvasses");
  }, [navigate]);

  const handleCreateCanvas = async () => {
    const token = localStorage.getItem("token");
    if (!token || !newCanvasName.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/canvas/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newCanvasName }),
      });
      const data = await response.json();
      if (response.ok) {
        setCanvases([...canvases, data]);
        setNewCanvasName("");
      } else {
        setError(data.message || "Failed to create canvas");
      }
    } catch (error) {
      setError("An error occurred while creating the canvas");
    }
  };

  const handleShareCanvas = async (canvasId) => {
    const token = localStorage.getItem("token");
    if (!token || !shareByEmail.trim()) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/canvas/share/${canvasId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: shareByEmail }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSharedwith([...sharedwith, data]);
        setShareByEmail("");
      } else {
        setError(data.message || "Failed to share data");
      }
    } catch (error) {
      setError("An error occurred while sharing canvas");
    }
  };

  const handleDeleteCanvas = async (canvasId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/canvas/delete/${canvasId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCanvases(canvases.filter((canvas) => canvas._id !== canvasId));
      } else {
        setError(data.message || "Failed to delete canvas");
      }
    } catch (error) {
      setError("An error occurred while deleting the canvas");
    }
  };

  if (error) return <p className="text-red-400 text-center mt-4">{error}</p>;
  if (!profile)
    return <p className="text-white text-center mt-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-10">
          <input
            type="text"
            value={newCanvasName}
            onChange={(e) => setNewCanvasName(e.target.value)}
            placeholder="Enter canvas name"
            className="flex-grow px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleCreateCanvas}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white shadow-md"
          >
            Create Canvas
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Your Canvases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {canvases.length > 0 ? (
            canvases.map((canvas) => (
              <div
                key={canvas.id}
                className="p-4 rounded-xl bg-white/10 border border-white/20 shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{canvas.title}</h3>

                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/canvas/${canvas._id}`)}
                      className="px-4 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-white"
                    >
                      Open Canvas
                    </button>
                    <button
                      onClick={() =>
                        setSelectedCanvasForShare(
                          selectedCanvasForShare === canvas._id
                            ? null
                            : canvas._id
                        )
                      }
                      className="px-4 py-1 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white"
                    >
                      Share
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteCanvas(canvas._id)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    aria-label={`Delete ${canvas.title}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.72 4.5a.75.75 0 00-.72.75v.75H4.5a.75.75 0 000 1.5h1.5v10.5c0 1.24 1.01 2.25 2.25 2.25h7.5c1.24 0 2.25-1.01 2.25-2.25V7.5h1.5a.75.75 0 000-1.5h-1.5V5.25a.75.75 0 00-.72-.75H6.72zm2.28 1.5h6v.75H9v-.75zM8.25 9a.75.75 0 011.5 0v7.5a.75.75 0 01-1.5 0V9zm5.25.75a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0V9.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {selectedCanvasForShare === canvas._id && (
                  <div className="mt-3">
                    <input
                      type="email"
                      placeholder="Enter email to share"
                      value={shareByEmail}
                      onChange={(e) => setShareByEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
                    />
                    <button
                      onClick={() => handleShareCanvas(canvas._id)}
                      className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No canvases found. Start creating one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;