import { Link } from "react-router-dom";
import styles from "../styles/cs.module.css";

function Hero() {
  return (
    <div className="w-full mb-50">
      <div className="mx-auto text-center p-20">
        <div className={`${styles.glow}`}> </div>
        <h1
          className={`lg:text-9xl text-8xl font-extrabold mt-40 relative z-1 ${styles.chrome}`}
        >
          FLIPPED.
        </h1>
        <p className="text-xl text-text-primary relative z-1">
          app for resellers to track their profit
        </p>
        <p className="text-xl text-text-primary relative z-1 mt-10">
          This website was created to help keep track of money spent vs money
          earn and using sell data to predict which items sell best.
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-green-primary text-text-primary border border-green-hover px-6 py-3 rounded-xl font-semibold hover:bg-green-hover hover:scale-105 transition-all"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="bg-silver-muted text-bg border border-border px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-silver-primary transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Hero;
