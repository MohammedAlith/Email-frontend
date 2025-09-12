import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetch("https://emai-node.onrender.com/emails/refresh");
      navigate("/emails/refresh");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buttons = [
    { label: "Compose", path: "/" },
    { label: "Received", path: "/emails/received" },
    { label: "Sent", path: "/emails/sent" },
  ];

  return (
    <nav className="m-2 text-white px-4 py-3 flex justify-between items-center relative">
      <div className="hidden md:flex gap-3">
        {buttons.map(btn => (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            className={`px-4 py-2 rounded-lg ${
              location.pathname === btn.path ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      
      <div className="md:hidden flex items-center gap-2">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
        </button>

        <button
          onClick={handleRefresh}
          className="px-3 py-1 rounded-lg bg-white text-blue-700 flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faRotateRight} spin={loading} />
        </button>
      </div>

      
      <div className="hidden md:flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded-lg text-center"
        >
          Back
        </button>

       <button
  onClick={handleRefresh}
  className="w-10 h-10 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
>
  <FontAwesomeIcon icon={faRotateRight} spin={loading} />
</button>

      </div>

      
      {mobileOpen && (
        <div className="absolute top-full left-0   flex flex-col p-4 gap-5 md:hidden z-50">
          {buttons.map(btn => (
            <button
              key={btn.path}
              onClick={() => { navigate(btn.path); setMobileOpen(false); }}
              className={`px-4 py-2 rounded-lg text-left ${
                location.pathname === btn.path ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={() => { navigate("/"); setMobileOpen(false); }}
            className="px-4 py-2 rounded-lg text-left bg-black text-white"
          >
            Back
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
