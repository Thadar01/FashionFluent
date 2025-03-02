"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const Suppliers = () => {
  const router = useRouter();
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/supplier"); // Fetch all suppliers
      const data = await response.json();

      if (response.ok) {
        setSupplier(data);
        setError(null);
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

  useEffect(() => {
    fetchSupplier();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      fetchSupplier(); // Refetch all suppliers when search input is cleared
      return;
    }

    const fetchSearchSupplier = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/supplier?q=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
          setSupplier(data);
          setError(null);
        } else {
          setError(data.error || "An error occurred while searching supplier.");
        }
      } catch (err) {
        setError("Failed to search supplier data");
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchSupplier();
  }, [searchTerm]);

  const handleClick = () => {
    router.push("/Admin/MainDashboard/Suppliers/CreateSupplier");
  };

  const handleDelete = async (supplierID) => {
    if (!supplierID) return;
    try {
      const response = await fetch(`/api/supplier/${supplierID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete supplier");
      }

      setSupplier((prevSupplier) =>
        prevSupplier.filter((s) => s.SupplierID !== supplierID)
      );
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (supplierID) => {
    if (!supplierID) return; // Ensure supplierID is valid
    router.push(
      `/Admin/MainDashboard/Suppliers/CreateSupplier?id=${supplierID}&edit=${true}`
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex">
      <NavBar />
      <div className="w-full m-4 flex flex-col gap-4">
        <div className="w-full flex justify-between">
          <h1 className="text-[30px] font-semibold">Suppliers</h1>
          <button
            className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
            onClick={handleClick}
          >
            Add
          </button>
        </div>

        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 my-3 w-[20%]"
        />

        <div className="w-full">
          {/* Header Row with Borders */}
          <div className="grid grid-cols-4 w-[70%]">
            <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
              Name
            </div>
            <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
              Phone
            </div>
            <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
              Email
            </div>
            <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
              Address
            </div>
          </div>

          {supplier.length === 0 ? (
            loading ? (
              <p className="p-4">loading...</p>
            ) : (
              <p className="p-4">No supplier available</p>
            )
          ) : (
            <div>
              {supplier.map((sup) => (
                <div key={sup.SupplierID} className="flex">
                  <div className="grid grid-cols-4 w-[70%]">
                    <div className="border border-black text-center py-2">
                      {sup.SupplierName}
                    </div>
                    <div className="border border-black text-center py-2">
                      {sup.SupplierPhoneNo}
                    </div>
                    <div className="border border-black text-center py-2">
                      {sup.SupplierEmail}
                    </div>
                    <div className="border border-black text-center py-2">
                      {sup.SupplierAddress}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="ml-2 text-red-600 hover:underline"
                      onClick={() => handleDelete(sup.SupplierID)}
                    >
                      Delete
                    </button>
                    <button
                      className="ml-2 text-blue-600 hover:underline"
                      onClick={() => handleEdit(sup.SupplierID)}
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
    </div>
  );
};

export default Suppliers;
