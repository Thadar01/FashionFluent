"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const CreateSupplier = () => {
  const router = useRouter();
  const [supplier, setSupplier] = useState({
    supplierName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleAddSupplier = async () => {
    const { supplierName, email, phone, address } = supplier;

    if (!supplierName || !email || !phone || !address) {
      alert("All fields are required");
      return;
    }

    if (!email.includes("@gmail.com")) {
      alert("Please enter a valid Gmail address");
      return;
    }

    if (phone.length < 10) {
      alert("Your phone number is not valid");
      return;
    }

    try {
      const res = await fetch("/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierName, email, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the supplier");
        return;
      }

      alert("Supplier added successfully");
      router.push("/Admin/MainDashboard/Suppliers");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission
        handleAddSupplier();
      }}
      className="flex"
    >
      <div className="w-[16%]">
        <NavBar />
      </div>
      <div className="m-4 flex flex-col gap-5 w-[400px]">
        {/* Title */}
        <p className="text-[30px] font-semibold">Add Supplier</p>

        {/* Supplier Name Input */}
        <div className="flex flex-col gap-3">
          <label className="text-[18px]">Supplier Name</label>
          <input
            value={supplier.supplierName}
            onChange={(e) =>
              setSupplier({ ...supplier, supplierName: e.target.value })
            }
            className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Supplier Name"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-3">
          <label className="text-[18px]">Email</label>
          <input
            value={supplier.email}
            onChange={(e) =>
              setSupplier({ ...supplier, email: e.target.value })
            }
            className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Supplier Email"
          />
        </div>

        {/* Phone No Input */}
        <div className="flex flex-col gap-3">
          <label className="text-[18px]">Phone No</label>
          <input
            value={supplier.phone}
            onChange={(e) =>
              setSupplier({ ...supplier, phone: e.target.value })
            }
            className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Supplier Phone Number"
          />
        </div>

        {/* Address Textarea */}
        <div className="flex flex-col gap-3">
          <label className="text-[18px]">Address</label>
          <textarea
            value={supplier.address}
            onChange={(e) =>
              setSupplier({ ...supplier, address: e.target.value })
            }
            className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Supplier Address"
          />
        </div>

        {/* Add Button */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            className="bg-[#f5cba9] p-2  border-2 border-black rounded-xl text-[18px] font-semibold hover:bg-[#f6be90] w-[20%] "
          >
            Add
          </button>
          <button
            onClick={() => router.push("/Admin/MainDashboard/Suppliers")}
            className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateSupplier;
