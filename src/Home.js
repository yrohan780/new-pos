import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <nav class="navbar fixed-top navbar-dark bg-dark">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/">
            Offline POS
          </Link>
          <Link class="navbar-brand" to="/form">
            Form
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Home;
