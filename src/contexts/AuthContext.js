// src/contexts/AuthContext.js
import { createContext, useEffect, useState } from "react";
import { account, ID } from "../api/appwrite";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore session if one exists
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await account.get(); // throws if no active session

        // ✅ Generate JWT for current session
        const jwt = await account.createJWT();
        setUser({ ...currentUser, jwt: jwt.jwt });

        console.log("Session restored:", currentUser);
      } catch (err) {
        console.log("No active session:", err.message);
        setUser(null);
      }
    };
    restoreSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Delete any existing session first
      try {
        await account.deleteSession("current");
      } catch (err) {
        console.log("No existing session to delete");
      }

      // Create new session
      await account.createEmailPasswordSession(email, password);

      // Fetch user info
      const userInfo = await account.get();

      // ✅ Create JWT for authenticated user
      const jwt = await account.createJWT();

      // ✅ Store both user info + JWT in state
      setUser({ ...userInfo, jwt: jwt.jwt });

      return { ...userInfo, jwt: jwt.jwt };
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      // Create new user
      await account.create(ID.unique(), email, password);

      // Delete any existing session before login
      try {
        await account.deleteSession("current");
      } catch {}

      // Login automatically after signup
      await account.createEmailPasswordSession(email, password);

      const userInfo = await account.get();
      const jwt = await account.createJWT();

      setUser({ ...userInfo, jwt: jwt.jwt });
      return { ...userInfo, jwt: jwt.jwt };
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await account.deleteSession("current");
    } catch (err) {
      console.log("No session to delete on logout");
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
