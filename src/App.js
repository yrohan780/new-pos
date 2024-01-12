import React, { useEffect } from "react";
import "./App.css";
import MyForm from "./Form";

function App() {
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/service-worker.js", { scope: "/public/" })
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   }
  // }, []);

  return (
    <div className="App">
      <MyForm />
    </div>
  );
}

export default App;
