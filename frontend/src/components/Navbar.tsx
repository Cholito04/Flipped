import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = () => setNav(!nav);

  const handlePricing = () => {
    if (location.pathname === "/") {
      document
        .getElementById("pricing")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(
        () =>
          document
            .getElementById("pricing")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

  const handleHome = () => {
    if (location.pathname === "/") {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(
        () =>
          document
            .getElementById("home")
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  };

  const linkClass =
    "p-4 hover:text-green-primary transition-colors cursor-pointer";
  const mobileLinkClass =
    "w-full flex p-4 border-b border-border text-text-primary hover:text-green-primary transition-colors cursor-pointer uppercase";

  return (
    <div className="fixed w-full bg-bg text-text-primary px-6 py-4 flex items-center h-24 justify-between z-50">
      <Link to="/" className="w-full text-3xl font-bold text-green-primary m-4">
        FLIPPED.
      </Link>

      <ul className="hidden md:flex items-center gap-1">
        <li>
          <button onClick={handleHome} className={linkClass}>
            About
          </button>
        </li>
        <li>
          <Link to="/login" className={linkClass}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" className={linkClass}>
            Signup
          </Link>
        </li>
        <li>
          <button onClick={handlePricing} className={linkClass}>
            Pricing
          </button>
        </li>
      </ul>

      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      <div
        className={`fixed left-0 top-0 h-full w-[60%] bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out ${nav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mt-8 px-5">
          <Link to="/" className="text-3xl font-bold text-green-primary">
            FLIPPED.
          </Link>
        </div>
        <ul onClick={handleNav} className="mt-6">
          <li>
            <button onClick={handleHome} className={mobileLinkClass}>
              About
            </button>
          </li>
          <li>
            <Link to="/login" className={mobileLinkClass}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className={mobileLinkClass}>
              Signup
            </Link>
          </li>
          <li>
            <button onClick={handlePricing} className={mobileLinkClass}>
              Pricing
            </button>
          </li>
        </ul>
      </div>

      {nav && (
        <div
          onClick={handleNav}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </div>
  );
}
export default Navbar;
