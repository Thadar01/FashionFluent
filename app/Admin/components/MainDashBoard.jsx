"use client";
import React, { useState, useEffect, useRef } from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const MainDashBoard = () => {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

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
  const fetchSearchedStaff = async () => {
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
    }
  };

  // Fetch all staff on mount
  useEffect(() => {
    fetchInitialStaff();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      fetchInitialStaff();
    }
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

  const handleEdit = (StaffID) => {
    if (!StaffID) return; // Ensure StaffID is valid
    console.log("hello");
    router.push(`/Admin/MainDashboard/EditStaff?id=${StaffID}`);
  };

  return (
    <div className="flex ">
      <NavBar />
      {session?.user?.role === "Admin" ? (
        <div className="w-full m-4 flex flex-col gap-4">
          <h1 className="text-[30px] font-semibold">Staff</h1>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 my-3 w-[20%] "
          />

          <div className="w-full ">
            {/* Header Row with Borders */}
            <div className="grid grid-cols-4   w-[70%]">
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Name
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Role
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Email
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Phone Number
              </div>
            </div>

            {staff.length === 0 ? (
              <p className="p-4">No staff available</p>
            ) : (
              <div>
                {staff.map((member) => (
                  <div className="flex">
                    <div
                      key={member.StaffID}
                      className="grid grid-cols-4  w-[70%]"
                    >
                      <div className="border border-black text-center py-2">
                        {member.StaffName}
                      </div>
                      <div className="border border-black text-center py-2">
                        {member.StaffRole}
                      </div>
                      <div className="border border-black text-center py-2">
                        {member.StaffEmail}
                      </div>
                      <div className="border border-black text-center py-2">
                        {member.StaffPhoneNo}
                      </div>
                    </div>
                    <div className="flex justify-end ">
                      <button
                        className="ml-2 text-red-600 hover:underline"
                        onClick={() => handleDelete(member.StaffID)}
                      >
                        Delete
                      </button>
                      <button
                        className="ml-2 text-blue-600 hover:underline"
                        onClick={() => handleEdit(member.StaffID)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>You Cannot Access this page</div>
      )}
    </div>
  );
};
