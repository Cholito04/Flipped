import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";
import DashbNavbar from "./components/DashbNavbar";
import Items from "./components/Items";
import AddItem from "./components/AddItem";
import Stores from "./components/Stores";
import Trips from "./components/Trips";

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(() => {
    return !!localStorage.getItem("token") ? true : false;
  });
  // keep session in sync when token changes
  useEffect(() => {
    const checkSession = () => {
      setSession(!!localStorage.getItem("token"));
      setLoading(false);
    };

    // check once on mount
    checkSession();
    setSession(false);

    // sync between tabs
    window.addEventListener("storage", checkSession);

    return () => {
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  if (loading) return null;

  return (
    <div>
      <BrowserRouter>
        {session ? (
          // authenticated app
          <>
            <DashbNavbar setSession={setSession} />
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <div>
                    <div id="stats">
                      <Dashboard />
                    </div>
                    <div id="items">
                      <Items />
                    </div>
                  </div>
                }
              />
              <Route path="/items" element={<Items />} />
              <Route path="/additem" element={<AddItem />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </>
        ) : (
          // public site
          <>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Pricing />
                  </>
                }
              />
              <Route
                path="/login"
                element={<Login setSession={setSession} />}
              />
              <Route
                path="/signup"
                element={<Signup setSession={setSession} />}
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
