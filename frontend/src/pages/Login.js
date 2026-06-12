import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/chat");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand-box">
          <div className="brand-logo">C</div>
          <h1>ChatApp</h1>
          <p>Your own real-time private messaging app.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Login to continue your chats</p>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>

          <p className="auth-link">
            New here? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;