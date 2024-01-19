import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Bill = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [setButtonClicked] = useState(false);

  console.log(data);
  const get_sub = () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.22:5005/get_posdata "
        );
        setData(response.data);
        setButtonClicked(true);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        setShowForm(true);
      }
    };

    fetchData();
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }
  };
  console.log(get_sub);
  useEffect(() => {
    get_sub();
  }, []);

  return (
    <div>
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
      <div class="container-fluid full-height tableContainer">
        <div class="row full-height  justify-content-center  ">
          <div class="col-2-md-6 con-2">
            <div className="tbl">
              <h2>Column 3</h2>
              <p>Your content goes here.</p>

              {showForm && (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Invoice ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>

                      <th scope="col">Email</th>

                      {/* <th scope="col">Price</th>
                    <th scope="col">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.invoiceId}</td>
                        <td>{item.name}</td>
                        {/* <td>{item.time}</td> */}
                        <td>{moment(item.time).format("YYYY-MM-DD")}</td>
                        <td>{moment(item.time).format("HH:mm:ss")}</td>
                        <td>{item.email}</td>
                        {/* <td>{item.price}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* {showForm && (
              <Button variant="primary" onClick={handleSave}>
                Save Invoice
              </Button>
            )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
