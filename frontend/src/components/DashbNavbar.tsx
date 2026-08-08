import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setSession: Dispatch<SetStateAction<boolean>>;
}

function DashbNavbar({ setSession }: Props) {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleNav = () => setNav(!nav);

  const handleLog = () => {
    localStorage.removeItem("access");
    setSession(false);
    navigate("/");
  };

  const linkClass =
    "p-4 hover:text-green-primary transition-colors cursor-pointer";
  const mobileLinkClass =
    "flex p-4 border-b border-border text-text-primary hover:text-green-primary transition-colors cursor-pointer uppercase";

  const navLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/items", label: "Items" },
    { to: "/stores", label: "Stores" },
    { to: "/trips", label: "Trips" },
    { to: "/additem", label: "Add Item" },
  ];

  return (
    <div className="fixed w-full bg-bg text-text-primary px-6 py-4 flex items-center h-24 justify-between z-50">
      <Link
        to="/dashboard"
        className="text-3xl font-bold text-green-primary m-4"
      >
        FLIPPED.
      </Link>

      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-1">
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button onClick={handleLog} className={linkClass}>
            Logout
          </button>
        </li>
      </ul>

      {/* Mobile toggle */}
      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-[60%] bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out ${nav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mt-8 px-5">
          <Link
            to="/dashboard"
            className="text-3xl font-bold text-green-primary"
          >
            FLIPPED.
          </Link>
        </div>
        <ul onClick={handleNav} className="mt-6">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={mobileLinkClass}>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={handleLog} className={`${mobileLinkClass} w-full`}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* backdrop */}
      {nav && (
        <div
          onClick={handleNav}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </div>
  );
}

export default DashbNavbar;
