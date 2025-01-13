// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  doc, setDoc, query, where, collection, getDocs, arrayUnion, getAnalytics, addDoc, initializeFirestore, persistentLocalCache  } from "firebase/firestore"; // Add Firestore functions
import { getStorage } from "firebase/storage"; // Optional, for file uploads

// Function to add a session to Firestore
export const addSession = async (userId, focusTime, breakTime, date) => {
  try {
    const sessionRef = collection(db, "sessions");
    await addDoc(sessionRef, {
      userId,
      focusTime,
      breakTime,
      date,
    });
    console.log("Session added successfully.");
  } catch (error) {
    console.error("Error adding session:", error);
  }
};

// Function to update session data
export const addSessionData = async (userId, focusTime, breakTime, date) => {
  try {
    const sessionRef = collection(db, "sessions");
    await addDoc(sessionRef, {
      userId,
      focusTime,
      breakTime,
      date,
    });
    console.log("Session data added successfully.");
  } catch (error) {
    console.error("Error adding session data:", error);
  }
};

// Function to update user streaks (track consecutive focus sessions)
export const updateUserStreaks = async (userId, currentStreak) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { streaks: currentStreak }, { merge: true });
    console.log("User streak updated successfully.");
  } catch (error) {
    console.error("Error updating streaks:", error);
  }
};



// Your Firebase configuration (replace with your Firebase Console details)
const firebaseConfig = {
  apiKey: "AIzaSyAesyU8otVfduhyipGnVU8mzpb1hNYpRgE",
  authDomain: "focus-assistant-f3c13.firebaseapp.com",
  projectId: "focus-assistant-f3c13",
  storageBucket: "focus-assistant-f3c13.firebasestorage.app",
  messagingSenderId: "30066559593",
  appId: "1:30066559593:web:f907be358893eb59cab0f8",
  measurementId: "G-GQHGH5FCTF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); 
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(), 
});


const storage = getStorage(app); 
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };

// Function to check if a username already exists
export const checkUsernameAvailability = async (username) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; 
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw new Error("Unable to check username availability.");
  }
};

// Function to add a username to Firestore when creating an account
export const addUsernameToUser = async (userId, username) => {
  try {
    await setDoc(doc(db, "users", userId), { username }, { merge: true }); 
    console.log("Username added successfully to Firestore.");
  } catch (error) {
    console.error("Error adding username to Firestore:", error);
    throw new Error("Unable to add username.");
  }
};

// Function to update user XP in Firestore
export const updateUserXP = async (userId, xp) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { xp }, { merge: true });
    console.log("XP updated successfully.");
  } catch (error) {
    console.error("Error updating XP:", error);
  }
};

// Function to update achievements
export const updateUserAchievements = async (userId, achievement) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      achievements: arrayUnion(achievement),
    }, { merge: true });
    console.log("Achievement unlocked:", achievement);
  } catch (error) {
    console.error("Error updating achievements:", error);
  }
};

