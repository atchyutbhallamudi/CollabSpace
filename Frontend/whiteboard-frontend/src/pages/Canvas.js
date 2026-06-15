import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoardProvider from "../store/BoardProvider";
import ToolboxProvider from "../store/ToolboxProvider";
import Toolbar from "../components/Toolbar";
import Board from "../components/Board";
import Toolbox from "../components/Toolbox";
import { restoreElements } from "../utils/element";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CanvasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCanvas = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/canvas/load/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "failed to load canvas");
          return;
        }
        setCanvas({ ...data, elements: restoreElements(data.elements) });
        //console.log("Get Data: ", data);
      } catch (error) {
        setError("An error occured while fetching the canvas");
      } finally {
        setLoading(false);
      }
    };
    fetchCanvas();
  }, [id, navigate]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading canvas...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return (
    <BoardProvider initialCanvas={canvas} canvasId={id}>
      <ToolboxProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}

export default CanvasPage;