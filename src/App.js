import React, { useEffect } from "react";
import "./App.css";
import MyForm from "./Form";
import Home from "./Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form" element={<MyForm />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
