// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentGuideBot from "./StudentGuideBot";

function App() {
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 min-h-[420px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 font-semibold text-center rounded-t-lg ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 font-semibold text-center rounded-t-lg ${
                activeTab === "signup"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "login" ? (
              <Login setToken={setToken} />
            ) : (
              <Signup />
            )}
          </div>
        </div>
      </div>
    );
  }

  // After login
  return (
    <div className="h-screen bg-green-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Welcome to Career Guide
      </h1>
      {/* Pass token to StudentGuideBot so it can save responses */}
      <StudentGuideBot token={token} />
    </div>
  );
}

export default App;
