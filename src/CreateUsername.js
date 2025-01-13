
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase"; 
import { setDoc, doc } from "firebase/firestore"; 

const CreateUsername = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");
  };

  const validateUsername = (username) => {
    // Check for non-empty username and prevent spaces or special characters
    const regex = /^[a-zA-Z0-9_]+$/; // Alphanumeric and underscores allowed
    if (!username || username.length < 3 || username.length > 15 || !regex.test(username)) {
      setError("Username must be between 3-15 characters, and contain only letters, numbers, and underscores.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) return;

    try {
      await setDoc(doc(db, "users", userId), { username }, { merge: true });
      console.log("Username set successfully");
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Error setting username:", error.message);
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="create-username-container">
      <h2>Create Your Username</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Create Username</button>
      </form>
    </div>
  );
};

export default CreateUsername;

