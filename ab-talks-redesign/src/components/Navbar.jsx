import React from "react";

function Navbar({ navigate }) {
  return (
    <nav className="navbar">

      <button
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        AB<span>Talks</span>
      </button>

      <div className="nav-links">

        <button onClick={() => navigate("/")}>
          Home
        </button>

        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/day/1")}>
          Challenge
        </button>

      </div>

      <button
        className="nav-start"
        onClick={() => navigate("/dashboard")}
      >
        START →
      </button>

    </nav>
  );
}

export default Navbar;