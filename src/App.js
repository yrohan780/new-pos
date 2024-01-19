import React, { useEffect } from "react";
import "./App.css";
import Form from "./Form";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import Bill from "./Invoice";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/Bill" element={<Bill />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
