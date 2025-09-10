import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentGuideBot from "./StudentGuideBot";  // 👈 import the bot

function App() {
  const [token, setToken] = useState("");

  if (!token) {
    return (
      <div>
        <Signup />
        <hr />
        <Login setToken={setToken} />
      </div>
    );
  }

  // Once logged in, show bot
  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-xl mb-4">Welcome to Career Guide</h1>
      <StudentGuideBot />
    </div>
  );
}

export default App;
