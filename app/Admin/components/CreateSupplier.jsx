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
      router.push("/MainDashboard/Suppliers");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <div>
        <p>Supplier Name</p>
        <input
          value={supplier.supplierName}
          onChange={(e) =>
            setSupplier({ ...supplier, supplierName: e.target.value })
          }
        />
        <p>Email</p>
        <input
          value={supplier.email}
          onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
        />
        <p>Phone No</p>
        <input
          value={supplier.phone}
          onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
        />
        <p>Address</p>
        <textarea
          value={supplier.address}
          onChange={(e) =>
            setSupplier({ ...supplier, address: e.target.value })
          }
        />
        <button onClick={handleAddSupplier}>Add</button>
      </div>
    </div>
  );
};

export default CreateSupplier;
