"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const EditStaff = () => {
  const [staffName, setStaffName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Param = useSearchParams();
  const id = Param.get("id");
  const router = useRouter();

  // Fetch staff data based on id
  useEffect(() => {
    const fetchStaffData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/staff/${id}`);
        const data = await response.json();

        if (response.ok) {
          // Assuming response contains staff data in data object
          setStaffName(data.StaffName || "");
          setEmail(data.StaffEmail || "");
          setPhone(data.StaffPhoneNo || "");
        } else {
          setError(data.error || "Failed to fetch staff data");
        }
      } catch (error) {
        setError("Error fetching staff data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffName, email, phone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error updating staff data");
      }

      alert("Edit Successful");
      router.push("/Admin/MainDashboard/Staffs");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="m-4 flex flex-col gap-5 w-[400px]">
        {/* Title */}
        <p className="text-[30px] font-semibold">Edit Staff</p>
        {loading ? (
          <p>loading</p>
        ) : (
          <>
            {" "}
            <div className="flex flex-col gap-3">
              <label className="text-[18px]">User Name</label>
              <input
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
              />
            </div>
            {/* Email Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[18px]">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
              />
            </div>
            {/* Phone Number Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[18px]">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
              />
            </div>
            {/* Edit Button */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-[#f5cba9] p-2  border-2 border-black rounded-xl text-[18px] font-semibold hover:bg-[#f6be90] w-[20%] "
              >
                Edit
              </button>
              <button
                onClick={() => router.push("/Admin/MainDashboard")}
                className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditStaff;
