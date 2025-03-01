"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const EditSupplier = () => {
  const router = useRouter();
  const [supplier, setSupplier] = useState({
    supplierName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the supplier ID from query params

  // Fetch the supplier data when the component loads
  useEffect(() => {
    if (!id) {
      router.push("/suppliers"); // Redirect if there's no supplier ID
      return;
    }

    const fetchSupplier = async () => {
      try {
        const res = await fetch(`/api/supplier/${id}`);
        const data = await res.json();

        if (res.ok) {
          setSupplier({
            supplierName: data.SupplierName,
            email: data.SupplierEmail,
            phone: data.SupplierPhoneNo,
            address: data.SupplierAddress,
          });
        } else {
          setError(data.error || "Failed to fetch supplier data");
        }
      } catch (err) {
        setError("An error occurred while fetching supplier data");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, router]);

  // Handle form submission for editing the supplier data
  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/supplier/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Supplier updated successfully!");
        router.push("/Admin/MainDashboard/Suppliers"); // Redirect after successful edit
      } else {
        alert(data.error || "Failed to update supplier");
      }
    } catch (err) {
      alert("An error occurred while updating the supplier");
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <NavBar />
      <div className="m-4 flex flex-col gap-5 w-[400px]">
        {/* Title */}
        <p className="text-[30px] font-semibold">Add Supplier</p>
        {loading ? (
          <p>loading..</p>
        ) : (
          <>
            {" "}
            {/* Supplier Name Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[18px]">Supplier Name</label>
              <input
                value={supplier.supplierName}
                onChange={(e) =>
                  setSupplier({ ...supplier, supplierName: e.target.value })
                }
                className="p-2 border-2 border-black rounded-lg text-[18px] focus:outline-none focus:border-[#f5cba9]"
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
              />
            </div>
            {/* Add Button */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleEdit}
                className="bg-[#f5cba9] p-2  border-2 border-black rounded-xl text-[18px] font-semibold hover:bg-[#f6be90] w-[20%] "
              >
                Edit
              </button>
              <button
                onClick={() => router.push("/Admin/MainDashboard/Suppliers")}
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

export default EditSupplier;
