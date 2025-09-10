import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      alert("User created! You can now login.");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="flex flex-col w-80 mx-auto mt-20 gap-4">
      <h2 className="text-xl font-bold">Signup</h2>
      <input className="border p-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white p-2 rounded" onClick={handleSignup}>Signup</button>
    </div>
  );

}
