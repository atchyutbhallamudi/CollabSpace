import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CanvasPage from "./pages/Canvas";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/canvas/:id" element={<CanvasPage />}></Route> 
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;