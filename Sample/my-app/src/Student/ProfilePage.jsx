import { useEffect, useState } from "react";

import api, { getApiError } from "../api";

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    skills: "",
    description: "",
  });
  const [savedProfile, setSavedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState({ error: "", success: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        const profileData = {
          name: data.full_name || "",
          email: data.email || "",
          phone: data.profile.phone || "",
          college: data.profile.college || "",
          skills: data.profile.skills || "",
          description: data.profile.description || "",
        };
        setFormData(profileData);

        if (
          profileData.phone ||
          profileData.college ||
          profileData.skills ||
          profileData.description
        ) {
          setSavedProfile(profileData);
        }
      } catch (requestError) {
        setStatus({
          error: getApiError(requestError, "Unable to load profile."),
          success: "",
        });
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/me/profile", {
        phone: formData.phone,
        college: formData.college,
        skills: formData.skills,
        description: formData.description,
        resume_url: "",
      });
      setSavedProfile(formData);
      setIsEditing(false);
      setStatus({ error: "", success: "Profile Saved Successfully!" });
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Save Failed!"),
        success: "",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setStatus({ error: "", success: "" });
  };

  const handleDelete = async () => {
    try {
      await api.put("/users/me/profile", {
        phone: "",
        college: "",
        skills: "",
        description: "",
        resume_url: "",
      });
      setSavedProfile(null);
      setFormData((current) => ({
        ...current,
        phone: "",
        college: "",
        skills: "",
        description: "",
      }));
      setIsEditing(false);
      setStatus({ error: "", success: "Profile Deleted Successfully!" });
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Delete Failed!"),
        success: "",
      });
    }
  };

  return (
    <div className="profile-container">
      <h2>Student Profile</h2>

      {(isEditing || !savedProfile) && (
        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            disabled
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />

          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="college"
            placeholder="Enter College Name"
            value={formData.college}
            onChange={handleChange}
          />

          <input
            type="text"
            name="skills"
            placeholder="Enter Skills (e.g. React, Node)"
            value={formData.skills}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>

          {status.error && <p className="resume-message error">{status.error}</p>}
          {status.success && <p className="resume-message success">{status.success}</p>}

          <button type="submit">{isEditing ? "Update Profile" : "Save Profile"}</button>
        </form>
      )}

      {savedProfile && !isEditing && (
        <div className="profile-card">
          <h3>{savedProfile.name}</h3>
          <p>
            <strong>Email:</strong> {savedProfile.email}
          </p>
          <p>
            <strong>Phone:</strong> {savedProfile.phone}
          </p>
          <p>
            <strong>College:</strong> {savedProfile.college}
          </p>
          <p>
            <strong>Skills:</strong> {savedProfile.skills}
          </p>
          <p>
            <strong>Description:</strong> {savedProfile.description}
          </p>

          {status.error && <p className="resume-message error">{status.error}</p>}
          {status.success && <p className="resume-message success">{status.success}</p>}

          <div className="profile-actions">
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
