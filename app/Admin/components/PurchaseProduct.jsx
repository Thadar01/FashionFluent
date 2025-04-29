"use client"; // Ensures this runs on the client side
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import Link from "next/link";

const PurchaseProduct = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Stores the final search date
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchPurchases(); // Fetch all purchases initially
  }, []);

  const fetchPurchases = async (date = "") => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`/api/purchase?date=${date}`);
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
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
    fetchPurchases();
  };

  return (
    <div className="flex">
      <div className="w-[16%]">
        <NavBar />
      </div>
      <div className="p-5 w-full relative">
        <h2 className="text-[30px] font-semibold mb-4">Purchase Product</h2>
        <Link
          href={"/Admin/MainDashboard/PurchaseForm"}
          className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90] text-center absolute top-4 right-5"
        >
          Purchase
        </Link>
        <div className="flex gap-2">
          <form
            className="flex gap-3 mb-4 items-center"
            onSubmit={(e) => {
              e.preventDefault(); // Prevents default form submission
              handleSearchClick();
            }}
          >
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="p-2 border-2 border-black rounded-lg"
              required
            />
            <button
              type="submit"
              className="bg-[#f5cba9] p-2 rounded-lg font-semibold border-2 border-black hover:bg-[#f6be90]"
            >
              Search
            </button>
          </form>
          <button
            onClick={handleShowAll}
            className="bg-gray-200 p-2 rounded-lg font-semibold border-2 border-black hover:bg-gray-300 h-[45px]"
          >
            Show All
          </button>
        </div>

        {loading ? (
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default PurchaseProduct;
