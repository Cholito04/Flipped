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
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      const { data } = await axios.post(`${API_URL}/auth/web/sign-in`, {
        username,
        password,
      });
      localStorage.setItem("token", data.access);
      navigate("/dashboard", { state: { username: data.username } });
    } catch (err: any) {
      setError(
        err.response?.status === 400
          ? err.response?.data.error
          : "Network error. Please check your connection.",
      );
      console.error(err);
    }
  }

  const inputClass =
    "bg-card border border-border text-text-primary rounded-lg px-4 py-3 w-full focus:outline-none focus:border-green-hover placeholder-text-muted";

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border-dark w-full max-w-100 rounded-2xl overflow-hidden">
          <div className="bg-green-primary text-center px-8 py-6 border-b border-border">
            <h1 className="text-4xl font-extrabold text-silver-primary">
              SIGNUP
            </h1>
            <p className="text-silver-primary opacity-70 text-sm mt-1">
              Create your Flipped account
            </p>
          </div>
          <div className="px-8 py-8 flex flex-col gap-4">
            <input
              name="username"
              className={inputClass}
              placeholder="Username"
            />
            <input
              name="email"
              className={inputClass}
              placeholder="Email"
              type="email"
            />
            <input
              name="password"
              className={inputClass}
              placeholder="Password"
              type="password"
            />
            <button
              type="submit"
              className="bg-green-primary text-silver-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover transition-all mt-2"
            >
              Sign Up
            </button>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <p className="text-text-muted text-sm text-center">
              Already have an account?{" "}
              <a href="/login" className="text-green-primary hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
export default Signup;
