import React, { useState, useEffect, useCallback } from "react";
import "./MyForm.css";
import { Link } from "react-router-dom";
import moment from "moment";
let flag_click = "0";
const Form = () => {
  const [db, setDb] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", time: "" });

  const syncData = useCallback(
    async (formDataArray) => {
      if (flag_click === "0" && formDataArray.length > 0) {
        flag_click = "1";
        try {
          await fetch("http://192.168.1.22:5005/post_posdata ", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ formDataArray }),
          });
          console.log(formDataArray);

          const transaction = db.transaction(["offlineFormData"], "readwrite");
          const objectStore = transaction.objectStore("offlineFormData");
          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = (event) => {};
          console.log("Data removed from IndexedDB");
          flag_click = "0";
        } catch (error) {
          console.error("Error syncing data:", error);
          flag_click = "0";
        }
      }
    },
    [db]
  );

  useEffect(() => {
    const initIndexedDB = async () => {
      const request = indexedDB.open("OfflineFormDataDB", 1);
      let database;

      request.onupgradeneeded = (event) => {
        database = event.target.result;
        database.createObjectStore("offlineFormData", {
          keyPath: "id",
          autoIncrement: true,
        });
      };

      request.onsuccess = (event) => {
        setDb(event.target.result);
      };
    };

    initIndexedDB();

    setFormData((prevData) => ({
      ...prevData,
      time: moment().format("YYYY-MM-DDTHH:mm:ss"),
    }));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOnline = navigator.onLine;

      if (isOnline && db) {
        const transaction = db.transaction(["offlineFormData"], "readonly");
        const objectStore = transaction.objectStore("offlineFormData");
        const request = objectStore.openCursor();
        const formDataArray = [];

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const formData = { id: cursor.value.id, ...cursor.value };
            formDataArray.push(formData);
            cursor.continue();
          } else {
            // Cursor has reached the end, sync bulk data
            if (formDataArray.length > 0) {
              syncData(formDataArray);
            }
          }
        };
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [db, syncData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const transaction = db.transaction(["offlineFormData"], "readwrite");
    const objectStore = transaction.objectStore("offlineFormData");
    const currentTime = moment().format("YYYY-MM-DDTHH:mm:ss");
    const addRequest = objectStore.add({
      name: formData.name,
      email: formData.email,
      time: currentTime,
    });
    console.log("Time ", formData);

    addRequest.onsuccess = (event) => {
      const newFormData = { id: event.target.result, ...formData };

      const isOnline = navigator.onLine;

      if (isOnline) {
        syncData(newFormData);
      }
      setFormData({
        ...formData,
        name: "",
        email: "",
        time: currentTime,
      });
    };
  };
  useEffect(() => {
    const handleOnline = () => {
      // Handle online state, e.g., sync data
      console.log("Online now");
    };

    const handleOffline = () => {
      // Handle offline state, e.g., store data locally
      console.log("You are offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="formCOntianer">
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
      <div className="form-container">
        <form id="offlineForm" onSubmit={handleSubmit}>
          <label htmlFor="name" data-aos="fade-right">
            Name:
          </label>
          <input
            data-aos="fade-right"
            data-aos-delay="100"
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-2"
            placeholder="Enter Your Name"
          />
          <br />

          <label htmlFor="email" data-aos="fade-right" data-aos-delay="200">
            Email:
          </label>
          <input
            data-aos="fade-right"
            data-aos-delay="300"
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter Your Email"
          />
          <br />

          <input
            type="hidden"
            id="time"
            name="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />

          <button
            data-aos="fade-right"
            data-aos-delay="400"
            type="submit"
            className="mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
