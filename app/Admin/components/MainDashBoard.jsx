"use client";
import React, { useState, useEffect, useRef } from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";

export const MainDashBoard = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Fetch all staff on mount
  useEffect(() => {
    const fetchInitialStaff = async () => {
      try {
        const response = await fetch(`/api/staff`);
        const data = await response.json();
        if (response.ok) {
          setStaff(data);
        } else {
          setError(data.error || "An error occurred while fetching staff.");
        }
      } catch (err) {
        setError("Failed to fetch staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStaff();
  }, []);

  // Fetch staff based on searchTerm (without full loading state)
  useEffect(() => {
    if (searchTerm === "") return; // Avoid unnecessary fetch when search is cleared

    const fetchSearchedStaff = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/staff?q=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
          setStaff(data);
        } else {
          setError(data.error || "An error occurred while searching staff.");
        }
      } catch (err) {
        setError("Failed to search staff data");
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchedStaff();
  }, [searchTerm]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [staff]);

  const handleDelete = async (staffID) => {
    if (!staffID) return;
    setLoading(true); // Show loading only for deletion

    try {
      const response = await fetch(`/api/staff/${staffID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete staff");
      }

      setStaff((prevStaff) => prevStaff.filter((s) => s.StaffID !== staffID));
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <NavBar />
      {loading && <div>Loading...</div>}

      {session?.user?.role === "Admin" ? (
        <div>
          <h1>Staff</h1>
          {searchLoading && <p>Searching...</p>}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 my-3"
          />

          {staff.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <ul>
              {staff.map((member) => (
                <li key={member.StaffID}>
                  {member.StaffName} - {member.StaffEmail} - {member.StaffRole}
                  <button
                    className="ml-3"
                    onClick={() => handleDelete(member.StaffID)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>You Cannot Access this page</div>
      )}
    </div>
  );
};
