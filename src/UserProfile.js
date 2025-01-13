import React, { useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: '/path/to/profile-picture.jpg', // You can replace this with a dynamic value
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setUser({
      ...user,
      name: newName,
      email: newEmail,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewName(user.name);
    setNewEmail(user.email);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        <div className="profile-details">
          {isEditing ? (
            <>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </>
          )}
        </div>
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEdit}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
