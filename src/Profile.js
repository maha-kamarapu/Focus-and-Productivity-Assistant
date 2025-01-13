import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Profile = () => {
  const handleSignOut = async () => {
    await signOut(auth);
    alert("Signed out successfully!");
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Profile;
