import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  setSession: Dispatch<SetStateAction<boolean>>;
}

function Login({ setSession }: Props) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/auth/web/sign-in`, {
        username,
        password,
      });
      localStorage.setItem("token", data.access);
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<{ sub: string }>(token);
        localStorage.setItem("access", decoded.sub);
      }
      setSession(true);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Username or password doesn't exist (case sensitive)");
      console.error(err);
    }
  }

  const inputClass =
    "bg-card border border-border text-text-primary rounded-lg px-4 py-3 w-full focus:outline-none focus:border-green-hover placeholder-text-muted";

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border-dark w-full max-w-100 h-120 rounded-2xl overflow-hidden">
          <div className="bg-green-primary text-center px-8 py-6 border-b border-border">
            <h1 className="text-4xl font-extrabold text-silver-primary">
              LOGIN
            </h1>
            <p className="text-silver-primary text-sm mt-1 opacity-70">
              To Flipped account
            </p>
          </div>
          <div className="px-8 py-14 flex flex-col gap-8">
            <input
              name="username"
              className={inputClass}
              placeholder="Username"
              type="text"
            />
            <input
              name="password"
              className={inputClass}
              placeholder="Password"
              type="password"
            />
            <button
              type="submit"
              className="bg-green-primary text-text-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover transition-all mt-2"
            >
              Login
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <p className="text-text-muted text-sm text-center">
              Don't have an account?{" "}
              <a href="/signup" className="text-green-primary hover:underline">
                sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
export default Login;
