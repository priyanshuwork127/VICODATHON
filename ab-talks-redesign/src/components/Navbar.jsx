import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#home" className="logo" onClick={closeMenu}>
        <span className="logo-box">&lt;/&gt;</span>
        <span>
          AB<span>Talks</span>
        </span>
      </a>

      <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#challenge" onClick={closeMenu}>Challenge</a>
        <a href="#journey" onClick={closeMenu}>Journey</a>
        <a href="#platforms" onClick={closeMenu}>Platforms</a>
        <a href="#about" onClick={closeMenu}>About</a>

        <a href="/login" className="mobile-login">
          Login
        </a>
      </nav>

      <div className="nav-right">
        <a href="/login" className="login-btn">
          Login
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}