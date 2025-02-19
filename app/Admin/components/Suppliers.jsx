"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const Suppliers = () => {
  const router = useRouter();
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = () => {
    router.push("/Admin/MainDashboard/Suppliers/CreateSupplier");
  };
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch("/api/supplier"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setSupplier(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching supplier.");
        }
      } catch (err) {
        setError("Failed to fetch supplier data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleDelete = async (supplierID) => {
    if (!supplierID) return; // Ensure ID exists before making a request
    try {
      const response = await fetch(`/api/supplier/${supplierID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete staff");
      }

      setSupplier((prevSupplier) =>
        prevSupplier.filter((s) => s.SupplierID !== supplierID)
      ); // Remove deleted staff from list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col gap-5">
        <h1>Suppliers</h1>
        <button className="bg-blue-300 h-10" onClick={() => handleClick()}>
          Create
        </button>
        <div>
          {supplier.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {supplier.map((sup) => (
                <div
                  key={sup.SupplierID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>name:{sup.SupplierName}</p>
                  <p>phone:{sup.SupplierPhoneNo}</p>
                  <p>email:{sup.SupplierEmail}</p>
                  <p>address:{sup.SupplierAddress}</p>
                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(sup.SupplierID)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
