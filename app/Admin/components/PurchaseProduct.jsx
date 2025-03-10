"use client"; // Ensures this runs on the client side
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import Link from "next/link";

const PurchaseProduct = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Stores the final search date

  useEffect(() => {
    fetchPurchases(); // Fetch all purchases initially
  }, []);

  const fetchPurchases = async (date = "") => {
    try {
      const response = await fetch(`/api/purchase?date=${date}`);
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleSearchClick = () => {
    if (searchDate !== searchQuery) {
      setSearchQuery(searchDate); // Update the query state
      fetchPurchases(searchDate); // Fetch data based on search date
    }
  };

  const handleShowAll = () => {
    setSearchDate(""); // Clear the date
    setSearchQuery(""); // Reset the search query
    fetchPurchases(); // Fetch all purchases again
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="p-5 w-full">
        <h2 className="text-[30px] font-semibold mb-4">Purchase Product</h2>
        <div className="flex gap-3 mb-4 items-center">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="p-2 border-2 border-black rounded-lg"
          />
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white p-2 rounded-lg font-semibold border-2 border-black hover:bg-blue-600"
          >
            Search
          </button>
          <button
            onClick={handleShowAll}
            className="bg-gray-500 text-white p-2 rounded-lg font-semibold border-2 border-black hover:bg-gray-600"
          >
            Show All
          </button>
          <Link
            href={"/Admin/MainDashboard/PurchaseForm"}
            className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90] text-center"
          >
            Purchase
          </Link>
        </div>
        <table className="border-collapse border border-gray-500 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-500 p-2">Purchase ID</th>
              <th className="border border-gray-500 p-2">Total Quantity</th>
              <th className="border border-gray-500 p-2">Total Price</th>
              <th className="border border-gray-500 p-2">Date</th>
              <th className="border border-gray-500 p-2">Supplier ID</th>
              <th className="border border-gray-500 p-2">Staff ID</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <tr
                  key={purchase.PurchaseID}
                  className="border border-gray-500"
                >
                  <td className="border border-gray-500 p-2">
                    {purchase.PurchaseID}
                  </td>
                  <td className="border border-gray-500 p-2">
                    {purchase.TotalQuantity}
                  </td>
                  <td className="border border-gray-500 p-2">
                    {purchase.TotalPrice}
                  </td>
                  <td className="border border-gray-500 p-2">
                    {purchase.Date}
                  </td>
                  <td className="border border-gray-500 p-2">
                    {purchase.SupplierID}
                  </td>
                  <td className="border border-gray-500 p-2">
                    {purchase.StaffID}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No purchases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseProduct;
