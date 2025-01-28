import React from "react";
import { Link } from "react-router-dom";
import { useTrail, animated } from "react-spring";

function Home() {
  const lines = [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum",
    " has been the industry's standard dummy text ever since the 1500s, ",
    "when an unknown printer took a galley of type and scrambled it to make ",
    "a type specimen book. It has survived not only there is but",
  ];

  const trail = useTrail(lines.length, {
    opacity: 1,
    transform: "translateX(0px)",
    from: { opacity: 0, transform: "translateX(-50px)" },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <div className="homeCOntaienr">
      <nav className="navbar fixed-top navbar-dark bg-dark">
        <div className="container-md">
          <Link
            className="navbar-brand"
            style={{
              backgroundColor: "#ed1c24",
              padding: "0.2rem 1rem",
              fontWeight: "700",
            }}
            to="/"
          >
            Offline POS
          </Link>
          <div className="d-flex gap-5">
            <Link className="navbar-brand" to="/Bill">
              Invoice
            </Link>
            <Link className="navbar-brand" to="/form">
              Form
            </Link>
          </div>
        </div>
      </nav>

      <div className="Offline_Pos col-xl-8 col-lg-10 col-11">
        <h5 data-aos="fade-down">Welcome to</h5>
        <h1 className="mb-4">
          Offline{" "}
          <span
            className="postxt"
            data-aos-delay="300"
            data-aos-duration="1300"
            data-aos="zoom-in"
          >
            POS
          </span>
        </h1>
        {trail.map(({ opacity, transform }, index) => (
          <animated.p key={index} style={{ opacity, transform }}>
            {lines[index]}
          </animated.p>
        ))}
      </div>
    </div>
  );
}

export default Home;
