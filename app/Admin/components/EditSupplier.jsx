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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <NavBar />

      <div className="flex h-[728px]">
        <div className="flex h-full flex-col gap-5 justify-center items-center">
          <div className="w-[90%] flex flex-col gap-3">
            <div>
              <p>Supplier Name</p>
              <p>{id}</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={supplier.supplierName}
                onChange={(e) =>
                  setSupplier({ ...supplier, supplierName: e.target.value })
                }
              />
            </div>
            <div>
              <p>Email</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={supplier.email}
                onChange={(e) =>
                  setSupplier({ ...supplier, email: e.target.value })
                }
              />
            </div>
            <div>
              <p>Phone No</p>
              <input
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={supplier.phone}
                onChange={(e) =>
                  setSupplier({ ...supplier, phone: e.target.value })
                }
              />
            </div>
            <div>
              <p>Address</p>
              <textarea
                className="border-x-0 border-t-0 border-b-2 border-black w-full pt-4 px-1 pb-1 mb-4 bg-transparent focus:outline-none"
                value={supplier.address}
                onChange={(e) =>
                  setSupplier({ ...supplier, address: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleEdit}
            className="border-4 border-[#4C4135] rounded-lg py-2 px-6 text-[16px] hover:bg-[#ffd2a267] font-semibold"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;
