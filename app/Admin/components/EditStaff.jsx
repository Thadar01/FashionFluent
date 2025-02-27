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
      router.push("/Admin/MainDashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <NavBar />
      <div className="flex h-[728px]">
        <div className="flex h-full flex-col gap-5 justify-center items-center ">
          <div className="w-[90%] flex flex-col gap-3">
            <div>
              <p>User Name</p>
              <p>{id}</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            <div>
              <p>Email</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <p>Phone Number</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="border-4 border-[#4C4135] rounded-lg py-2 px-6 text-[16px] hover:bg-[#ffd2a267] font-semibold"
          >
            Edit
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default EditStaff;
