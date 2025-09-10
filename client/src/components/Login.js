import { useState } from "react";
import axios from "axios";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      setToken(res.data.token);
      alert(`Welcome ${res.data.name}`);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="flex flex-col w-80 mx-auto mt-20 gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleLogin}>Login</button>
    </div>
  );

}
