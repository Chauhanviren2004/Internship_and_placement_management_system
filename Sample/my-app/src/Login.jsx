import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import api, { BACKEND_ROOT_URL, getApiError } from "./api";
import { dashboardPathForRole, saveAuthSession } from "./auth";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "student",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const endpoint = `/${form.role}/login`;
      const { data } = await axios.post(`${BACKEND_ROOT_URL}${endpoint}`, {
        email: form.email,
        password: form.password,
      });
      saveAuthSession(data.token, data.user);
      navigate(dashboardPathForRole(form.role));
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to sign in."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left-panel">
        <div className="auth-branding">
          <div className="auth-logo">
            <span>IntelliPlace</span>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to manage internships, applications, and conversations.</p>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="form-container">
          <Link to="/" className="back-home-btn">
            Back to home
          </Link>

          <h2>Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>I AM A</label>
              <div className="role-selector">
                {["student", "company", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={form.role === role ? "active" : ""}
                    onClick={() => setForm((current) => ({ ...current, role }))}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>EMAIL</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <p className="resume-message error">{error}</p>}

            <button className="submit-btn" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="bottom-text">
            New to IntelliPlace? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
