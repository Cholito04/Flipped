import { Link } from "react-router-dom";
import styles from "../styles/cs.module.css";

function Trips() {
  return (
    <div className="w-full min-h-screen pl-10">
      <div className="mx-auto pt-40">
        <h1
          className={`lg:text-9xl text-6xl font-extrabold relative z-1 ${styles.chrome}`}
        >
          {" "}
          Trips.
        </h1>
        <ul>
          <li className="text-2xl text-white mt-5">cum</li>
        </ul>
      </div>
      <div className="mt-10 p-10 text-center">
        <Link
          to="/stores"
          className="bg-[#2a4a2a] text-[#d4e8b0] border border-[#3d6b3d] px-6 py-3 rounded-xl font-semibold hover:bg-[#3d6b3d] transition-all"
        >
          Add New Trip
        </Link>
      </div>
    </div>
  );
}
export default Trips;
