import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setSession: Dispatch<SetStateAction<boolean>>;
}

const API_URL = import.meta.env.VITE_API_URL;
function Signup({ setSession: _setSession }: Props) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username) return;

    try {
      const { data } = await axios.post(`${API_URL}/createuser`, {
        username,
        email,
        password,
      });

      console.log("User created:", data);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);
      navigate("/dashboard", { state: { username: data.username } });
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Username already exists");
      } else {
        setError("Network error. Please check your connection.");
      }
      console.error(err);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-[#111811] border border-[#1e2a1e] w-full max-w-100 h-120 rounded-2xl overflow-hidden">
          <div className="bg-[#2a4a2a] text-center px-8 py-6 border-b border-[#1e2a1e]">
            <h1 className="text-4xl font-extrabold text-white">SIGNUP</h1>
            <p className="text-[#5a6e4a] text-sm mt-1">
              Create your Flipped account
            </p>
          </div>

          <div className="px-8 py-8 flex flex-col gap-4">
            <input
              name="username"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              placeholder="User Name"
            />
            <input
              name="email"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              placeholder="Email"
              type="email"
            />
            <input
              name="password"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              placeholder="Password"
              type="password"
            />
            <button className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all mt-2">
              Sign Up
            </button>
            <p className="text-[#5a6e4a] text-sm text-center">
              Already have an account?{" "}
              <a href="/login" className="text-[#8aaa62] hover:underline">
                Log in
              </a>
              {error && (
                <p className="text-red-500 text-sm mx-auto p-4">{error}</p>
              )}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Signup;
