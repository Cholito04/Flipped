import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";
import DashbNavbar from "./components/DashbNavbar";
import Items from "./components/Items";
import AddItem from "./components/Additem";
import Stores from "./components/Stores";
import Trips from "./components/Trips";

function App() {
  const [session, setSession] = useState(() => {
    return localStorage.getItem("token") ? true : false;
  });
  // keep session in sync when token changes
  useEffect(() => {
    const checkSession = () => {
      setSession(!!localStorage.getItem("token"));
    };

    // check once on mount
    checkSession();

    // sync between tabs
    window.addEventListener("storage", checkSession);

    return () => {
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        {session ? <DashbNavbar setSession={setSession} /> : <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div id="home">
                  <Hero />
                </div>
                <div id="pricing">
                  <Pricing />
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login setSession={setSession} />} />
          <Route path="/signup" element={<Signup setSession={setSession} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/items" element={<Items />} />
          <Route path="/additem" element={<AddItem />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
