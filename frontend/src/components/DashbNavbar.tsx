import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setSession: Dispatch<SetStateAction<boolean>>;
}
function DashbNavbar({ setSession }: Props) {
  const [nav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!nav);
  };
  const navigate = useNavigate();

  const handleLog = () => {
    localStorage.removeItem("access");
    setSession(false);
    navigate("/");
  };
  return (
    <div className="fixed w-full bg-#000300 text-white px-6 py-4 flex items-center h-24 justify-between z-50">
      <Link
        to="/dashboard"
        className="w-full text-3xl font-bold text-[#7E8C54] m-4"
      >
        FLIPPED.
      </Link>
      <ul className="hidden md:flex items-center gap-1">
        <li>
          <Link
            to="/dashboard"
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            Home
          </Link>
        </li>
        <li>
          <Link to="/items" className="p-4 hover:text-[#7E8C54] cursor-pointer">
            Items
          </Link>
        </li>
        <li>
          <Link
            to="/stores"
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            Stores
          </Link>
        </li>
        <li>
          <Link to="/trips" className="p-4 hover:text-[#7E8C54] cursor-pointer">
            Trips
          </Link>
        </li>
        <li>
          <Link
            to="/additem"
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            addItems
          </Link>
        </li>
        <li>
          <button
            onClick={handleLog}
            className="p-4 hover:text-[#7E8C54] cursor-pointer"
          >
            logout
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
            : "fixed -left-full z-50"
        }
      >
        <div className="mt-8">
          {" "}
          <Link
            to="/dashboard"
            className="w-full text-3xl font-bold text-[#7E8C54] m-5"
          >
            FLIPPED.
          </Link>
        </div>

        <ul onClick={handleNav} className="uppercase p-4 ">
          <li>
            <Link
              to="/dashboard"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/items"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              items
            </Link>
          </li>
          <li>
            <Link
              to="/stores"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Stores
            </Link>
          </li>
          <li>
            <Link
              to="/trips"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              Trips
            </Link>
          </li>
          <li>
            <Link
              to="/additem"
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer"
            >
              addItems
            </Link>
          </li>
          <li>
            <button
              onClick={handleLog}
              className="flex p-4 border-b border-gray-600 hover:text-[#7E8C54] cursor-pointer w-full"
            >
              logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashbNavbar;
