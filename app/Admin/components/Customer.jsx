"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer");
      const data = await response.json();

      if (response.ok) {
        setCustomers(data);
        setFilteredCustomers(data);
      } else {
        setError(data.error || "An error occurred while fetching customers.");
      }
    } catch (err) {
      setError("Failed to fetch customer data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredCustomers(customers);
      } else {
        setFilteredCustomers(
          customers.filter(
            (customer) =>
              customer.CustomerName.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              customer.CustomerEmail.toLowerCase().includes(
                searchQuery.toLowerCase()
              )
          )
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, customers]);

  return (
    <div>
      <div className="flex">
        <div className="w-[16%]">
          <NavBar />
        </div>
        <div className="w-full m-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="w-full flex justify-between">
            <h1 className="text-[30px] font-semibold">Customers</h1>
          </div>

          {/* Search Input */}
          <div className="relative w-[20%] my-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 w-full rounded-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-3 top-5 transform -translate-y-1/2 size-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          {/* Customers Table */}
          <div className="w-[50%]">
            <div className="grid grid-cols-2 w-[70%]">
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Name
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Email
              </div>
            </div>
            {filteredCustomers.length === 0 ? (
              loading ? (
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <p className="p-4">No customers available</p>
              )
            ) : (
              <div>
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.CustomerID}
                    className="grid grid-cols-2 w-[70%]"
                  >
                    <div className="border border-black text-center py-2">
                      {customer.CustomerName}
                    </div>
                    <div className="border border-black text-center py-2">
                      {customer.CustomerEmail}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
