import { Link } from "react-router-dom";
import styles from "../styles/cs.module.css";

function Hero() {
  return (
    <div className="w-full  mb-50">
      <div className="mx-auto text-center p-20">
        <div className={`${styles.glow}`}> </div>
        {/* text sits on top */}
        <h1
          className={`lg:text-9xl text-8xl font-extrabold mt-40 relative z-1 ${styles.chrome}`}
        >
          FLIPPED.
        </h1>
        <p className={`text-xl text-white relative z-1`}>
          app for resellers to track their profit
        </p>{" "}
        <p className={`text-xl text-white relative z-1 mt-10`}>
          This website was created to help keep track of money spent vs money
          earn and using sell data to predict which items sell best.
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#376237] hover:scale-105 transition-all"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="bg-[#90a490] text-[#2a4a2a] border border-[#454645] px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-[#b0bdb0] transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Hero;
