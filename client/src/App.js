import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

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

  return <h1>Welcome to Career Guide</h1>;
}

export default App;
