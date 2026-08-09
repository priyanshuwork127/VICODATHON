import React, { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ChallengeDay from "./pages/ChallengeDay";

import "./App.css";


function App() {

  const [path, setPath] = useState(
    window.location.pathname
  );


  const navigate = (newPath) => {

    window.history.pushState(
      {},
      "",
      newPath
    );

    setPath(newPath);
  };


  useEffect(() => {

    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };

  }, []);


  if (path === "/dashboard") {

    return (
      <Dashboard
        navigate={navigate}
      />
    );

  }


  if (path.startsWith("/day/")) {

    return (
      <ChallengeDay
        navigate={navigate}
      />
    );

  }


  return (
    <Landing
      navigate={navigate}
    />
  );
}


export default App;