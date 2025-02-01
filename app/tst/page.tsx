"use client";
import React, { useState, useEffect } from "react";

const StaffList = () => {
  const [staff, setStaff] = useState([]); // Staff data state
  const [error, setError] = useState(null); // Error state
  const [searchName, setSearchName] = useState(""); // Search term state

  // Fetch staff data based on search name
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // If a search term is provided, fetch filtered data
        const searchQuery = searchName ? `&name=${searchName}` : "";
        const response = await fetch(`/api/staff?${searchQuery}`);

        if (!response.ok) {
          throw new Error("Failed to fetch staff");
        }
        const data = await response.json();
        setStaff(data); // Set the fetched staff data
      } catch (err) {
        setError(err.message); // Set error message if something goes wrong
      }
    };

    fetchStaff(); // Fetch data when the component mounts or searchName changes
  }, [searchName]); // Re-fetch when searchName changes

  return (
    <div>
      <h1>Staff List</h1>

      {/* Search input to filter staff by name */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && <p>Error: {error}</p>}

      {/* Display staff data */}
      {staff.length === 0 ? (
        <p>No staff found.</p>
      ) : (
        <ul>
          {staff.map((person) => (
            <li key={person.StaffID}>
              <strong>Name:</strong> {person.StaffName} <br />
              <strong>Role:</strong> {person.StaffRole}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffList;
