import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!nav);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handlePricing = () => {
    if (location.pathname === "/") {
      document
        .getElementById("pricing")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("pricing")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  const handleHome = () => {
    if (location.pathname === "/") {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="fixed w-full bg-[#0e0f0d] text-white px-6 py-4 flex items-center h-24 justify-between z-50">
      <Link to="/" className="w-full text-3xl font-bold text-[#7E8C54] m-4">
        FLIPPED.
      </Link>
      <ul className="hidden md:flex items-center gap-1">
        <li>
          <button
            onClick={handleHome}
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            About
          </button>
        </li>
        <li>
          <Link to="/login" className="p-4 hover:text-[#7E8C54] cursor-pointer">
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/signup"
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            Signup
          </Link>
        </li>
        <li>
          <button
            onClick={handlePricing}
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            Pricing
          </button>
        </li>
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      <div
        className={
          !nav
            ? "fixed left-0 top-0 w-[60%]  h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-400 z-50"
            : "fixed -left-full z-50 "
        }
      >
        <Link to="/" className="w-full text-3xl font-bold text-[#7E8C54] m-5">
          FLIPPED.
        </Link>

        <ul onClick={handleNav} className="uppercase p-4 ">
          <li>
            <button
              onClick={handleHome}
              className=" w-full flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              About
            </button>
          </li>
          <li>
            <Link
              to="/login"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Signup
            </Link>
          </li>
          <li>
            <button
              onClick={handlePricing}
              className=" w-full flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Pricing
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
