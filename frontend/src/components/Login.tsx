import { useState } from "react";
import { useNavigate} from "react-router-dom";
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
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Clear previous errors

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
        console.log(decoded);
        localStorage.setItem("access", decoded.sub);
      }
      setSession(true); 
      navigate("/dashboard");
    } catch (err: any) {
      setError("Username or password doesn't exist(case senseitive)");
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="bg-[#111811] border border-[#1e2a1e] w-full max-w-100 h-120 rounded-2xl overflow-hidden">
          <div className="bg-[#2a4a2a] text-center px-8 py-6 border-b border-[#1e2a1e]">
            <h1 className="text-4xl font-extrabold text-white">LOGIN</h1>
            <p className="text-[#5a6e4a] text-sm mt-1">To Flipped account</p>
          </div>

          <div className="px-8 py-14 flex flex-col gap-8">
            <input
              name="username"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              placeholder="username"
              type="text"
            />
            <input
              name="password"
              className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
              placeholder="Password"
              type="password"
            />

            <button className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all mt-2">
              Login
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <p className="text-[#5a6e4a] text-sm text-center">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#8aaa62] hover:underline">
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
