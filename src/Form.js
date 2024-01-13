import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyForm.css";

const MyForm = () => {
  const initialFormData = {
    name: "",
    email: "",
    phoneNo: "",
    city: "",
    country: "",
  };

  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    return storedFormData ? JSON.parse(storedFormData) : initialFormData;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear validation error on input change
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Function to handle offline storage
  const storeOfflineData = () => {
    const storedOfflineData =
      JSON.parse(localStorage.getItem("offlineData")) || [];
    storedOfflineData.push(formData);
    localStorage.setItem("offlineData", JSON.stringify(storedOfflineData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Name is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }
    if (!/^\d{10}$/.test(formData.phoneNo)) {
      validationErrors.phoneNo = "Invalid phone number";
    }
    if (!formData.city.trim()) {
      validationErrors.city = "City is required";
    }
    if (!formData.country.trim()) {
      validationErrors.country = "Country is required";
    }

    // If there are validation errors, update the state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If no validation errors, send data to API
    try {
      const response = await axios.post(
        "http://192.168.1.28:5000/formdata",
        formData
      );
      console.log("API Response:", response.data);

      // Optionally, you can clear the form data after successful submission
      setFormData(initialFormData);

      // Also, you may want to handle any additional logic or UI updates here
    } catch (error) {
      console.error("API Error:", error);

      // If the internet is off, store the data in local storage
      if (!navigator.onLine) {
        storeOfflineData();
      }

      // Handle errors, e.g., show an error message to the user
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <span className="error">{errors.name}</span>
        </label>

        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <span className="error">{errors.email}</span>
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
          <span className="error">{errors.phoneNo}</span>
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <span className="error">{errors.city}</span>
        </label>

        <label>
          Country:
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="USA">United States</option>
            <option value="CAN">Canada</option>
            {/* Add more countries as needed */}
          </select>
          <span className="error">{errors.country}</span>
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MyForm;
