const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Update canvas elements on the server
export const updateCanvas = async (canvasId, elements) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_BASE_URL}/api/canvas/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ canvasId, elements }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update canvas");
    }
    return data;
  } catch (error) {
    console.error("Canvas update error:", error);
    throw error;
  }
};

export const loadCanvas = async (canvasId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_BASE_URL}/api/canvas/load/${canvasId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load canvas");
    }

    return data;
  } catch (error) {
    console.error("Canvas load error:", error);
    throw error;
  }
};