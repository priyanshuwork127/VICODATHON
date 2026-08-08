import React, { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ChallengeDay from "./pages/ChallengeDay";

import "./App.css";

function App() {
  const [path, setPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const handleNavigation = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      handleNavigation
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleNavigation
      );
    };
  }, []);

  const navigate = (newPath) => {
    window.history.pushState(
      {},
      "",
      newPath
    );

    setPath(newPath);
  };

  if (path === "/") {
    return <Landing />;
  }

  if (path === "/dashboard") {
    return <Dashboard navigate={navigate} />;
  }

  if (path.startsWith("/day/")) {
    return <ChallengeDay navigate={navigate} />;
  }

  return <Landing />;
}

export default App;