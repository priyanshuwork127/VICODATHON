import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Landing() {
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} />
    </>
  );
}

export default Landing;