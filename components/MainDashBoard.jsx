"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";

export const MainDashBoard = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  // Fetch staff data when component mounts
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setStaff(data); // Store the staff data in state
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

    fetchStaff();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <NavBar />
      {session.user.role === "Admin" ? (
        <div>
          <h1>Staff</h1>
          {staff.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <ul>
              {staff.map((member) => (
                <li key={member.StaffID}>
                  {member.StaffName} - {member.StaffEmail} - {member.StaffRole}
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
