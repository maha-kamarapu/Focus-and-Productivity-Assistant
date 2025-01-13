import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Corrected import (use db instead of firestore)
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, query, where, collection, getDocs } from "firebase/firestore"; // Import Firestore functions from firebase/firestore

// Function to check if the username already exists in Firestore
const checkUsernameAvailability = async (username) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // If snapshot is empty, username is available
  } catch (error) {
    console.error("Error checking username availability:", error.message);
    return false; // Return false if there is an error checking availability
  }
};

// Function to add the username to the user's document in Firestore
const addUsernameToUser = async (uid, username) => {
  try {
    await setDoc(doc(db, "users", uid), { username }, { merge: true }); // Merge to avoid overwriting other fields
    console.log("Username added successfully to Firestore.");
  } catch (error) {
    console.error("Error adding username to Firestore:", error.message);
  }
};

const Login = ({ onLogin }) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Toggle between login and sign-up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // State for username
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
      localStorage.setItem("userId", userCredential.user.uid); // Save user ID for future use
      onLogin(userCredential.user.displayName || userCredential.user.email); // Pass username to parent
      navigate("/welcome"); // Redirect to Welcome Page
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      alert("Please fill in all fields to sign up.");
      return;
    }
  
    // Check if the username already exists
    try {
      console.log("Checking username availability for:", username);
      const usernameAvailable = await checkUsernameAvailability(username);
  
      // Debugging: Log whether the username is available or not
      console.log("Is username available?", usernameAvailable);
  
      if (!usernameAvailable) {
        setError("Username already taken, please choose another.");
        return;
      }
    } catch (error) {
      console.error("Error during username availability check:", error);
      setError("Unable to check username availability.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up user:", userCredential.user);
  
      // After successful sign up, save the username to Firestore
      await addUsernameToUser(userCredential.user.uid, username);
  
      alert("Account created successfully! You can now log in.");
      setIsCreatingAccount(false); // Return to the login screen
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert("Sign-up failed. Please try again.");
    }
  };
  
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in user:", result.user);

      // After Google login, ask for username and password
      const userId = result.user.uid;
      const usernameAvailable = await checkUsernameAvailability(username);

      if (!usernameAvailable) {
        setError("Username already taken, please choose another.");
        return;
      }

      await addUsernameToUser(userId, username);
      localStorage.setItem("userId", userId); // Save user ID for future use
      onLogin(username); // Pass username to parent
      navigate("/welcome"); // Redirect to Welcome Page
    } catch (error) {
      console.error("Error with Google sign-in:", error.message);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {isCreatingAccount ? (
        <div className="create-account">
          <h2>Create an Account</h2>
          <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
          <div className="separator">
            <span>or</span>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsCreatingAccount(false)}>Login</button>
          </p>
        </div>
      ) : (
        <div className="login">
          <h2>Login</h2>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsCreatingAccount(true)}>Sign Up</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;







