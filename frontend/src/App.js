import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/chat" />}
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/chat" />}
        />

        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/chat" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;