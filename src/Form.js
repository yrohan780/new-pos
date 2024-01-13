import React, { useState, useEffect, useCallback } from "react";
import "./MyForm.css";
import { Link } from "react-router-dom";

const MyForm = () => {
  const [db, setDb] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const syncData = useCallback(
    async (formData) => {
      try {
        const response = await fetch(
          "https://vedicastrologyforum.com/mt/sync.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        console.log("Data synced:", data);

        const transaction = db.transaction(["offlineFormData"], "readwrite");
        const objectStore = transaction.objectStore("offlineFormData");
        objectStore.delete(formData.id);

        console.log("Data removed from IndexedDB");
      } catch (error) {
        console.error("Error syncing data:", error);
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
        console.log(newFormData);
      }
    };
  };

  return (
    <>
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
      <div className="form-container">
        <form id="offlineForm" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default MyForm;
