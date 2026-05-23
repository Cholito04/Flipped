import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setSession: Dispatch<SetStateAction<boolean>>;
}

function Login({ setSession: setSession }: Props) {
  const navigate = useNavigate();

  const handleFakeLogin = () => {
    localStorage.setItem("token", "fake-token");
    setSession(true);
    navigate("/dashboard");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="bg-[#111811] border border-[#1e2a1e] w-full max-w-100 h-120 rounded-2xl overflow-hidden">
        <div className="bg-[#2a4a2a] text-center px-8 py-6 border-b border-[#1e2a1e]">
          <h1 className="text-4xl font-extrabold text-white">LOGIN</h1>
          <p className="text-[#5a6e4a] text-sm mt-1">To Flipped account</p>
        </div>

        <div className="px-8 py-14 flex flex-col gap-8">
          <input
            className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
            placeholder="Email"
            type="email"
          />
          <input
            className="bg-[#0d120d] border border-[#1e2a1e] text-[#d4e8b0] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#3d6b3d] placeholder-[#3a4a3a]"
            placeholder="Password"
            type="password"
          />
          <button
            onClick={handleFakeLogin}
            className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all mt-2"
          >
            Login
          </button>
          <p className="text-[#5a6e4a] text-sm text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#8aaa62] hover:underline">
              sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
