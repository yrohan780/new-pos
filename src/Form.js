import React, { useState, useEffect, useCallback } from "react";
import "./MyForm.css";
import { Link } from "react-router-dom";
let flag_click = "0";
const MyForm = () => {
  const [db, setDb] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const syncData = useCallback(
    async (formData) => {
      if (flag_click === "0") {
        flag_click = "1";
        console.log(formData);
        try {
          await fetch("https://vedicastrologyforum.com/mt/sync.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          // The 'response' variable is not used, so you can remove it
          // const response = await response.json();

          const transaction = db.transaction(["offlineFormData"], "readwrite");
          const objectStore = transaction.objectStore("offlineFormData");
          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = (event) => {
            console.log("All data deleted successfully");
          };
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
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOnline = navigator.onLine;

      if (isOnline && db) {
        const transaction = db.transaction(["offlineFormData"], "readonly");
        const objectStore = transaction.objectStore("offlineFormData");
        const request = objectStore.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;

          if (cursor) {
            const formData = { id: cursor.value.id, ...cursor.value };
            syncData(formData);
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
    const addRequest = objectStore.add({
      name: formData.name,
      email: formData.email,
    });

    addRequest.onsuccess = (event) => {
      const newFormData = { id: event.target.result, ...formData };

      const isOnline = navigator.onLine;

      if (isOnline) {
        syncData(newFormData);
      }
    };
    setFormData({
      name: "",
      email: "",
    });
  };

  return (
    <div className="formCOntianer">
      <nav className="navbar fixed-top navbar-dark bg-dark">
        <div className="container-md">
          <Link className="navbar-brand" to="/">
            Offline POS
          </Link>
          <Link className="navbar-brand" to="/form">
            Form
          </Link>
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

export default MyForm;
