"use client"; // Ensures this runs on the client side
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import Link from "next/link";

const Order = () => {
  const [orders, setorders] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Stores the final search date
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchorders = async (date = "") => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`/api/order?date=${date}`);
      const data = await response.json();
      setorders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching completes (success or error)
    }
  };

  useEffect(() => {
    fetchorders();
    const interval = setInterval(fetchorders, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleSearchClick = () => {
    if (searchDate !== searchQuery) {
      setSearchQuery(searchDate); // Update the query state
      fetchorders(searchDate); // Fetch data based on search date
    }
  };

  const handleShowAll = () => {
    setSearchDate(""); // Clear the date
    setSearchQuery(""); // Reset the search query
    fetchorders(); // Fetch all orders again
  };

  const handleUpdate = async (orderID) => {
    console.log("order ID", orderID);
    try {
      const response = await fetch(`/api/order/${orderID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ OrderStatus: 1 }), // Send the updated name
      });

      if (response.ok) {
        alert("Order confirm! Sent the orders to the delivery service.");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update category");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <div className="w-[16%]">
        <NavBar />
      </div>
      <div className="p-5 w-full relative">
        <h2 className="text-[30px] font-semibold mb-4">Order Confirmation</h2>

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
                <th className="border border-gray-500 p-2">Order ID</th>
                <th className="border border-gray-500 p-2">Order Date</th>
                <th className="border border-gray-500 p-2">Total Quantity</th>
                <th className="border border-gray-500 p-2">Total Price</th>
                <th className="border border-gray-500 p-2">Address</th>
                <th className="border border-gray-500 p-2">Phone No</th>
                <th className="border border-gray-500 p-2">Email</th>
                <th className="border border-gray-500 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.OrderID} className="border border-gray-500">
                    <td className="border border-gray-500 p-2">
                      {order.OrderID}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.OrderDate}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.TotalQuantity}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.TotalPrice}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.Address}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.PhoneNo}
                    </td>
                    <td className="border border-gray-500 p-2">
                      {order.Email}
                    </td>
                    <td className=" p-2 flex justify-center">
                      <button
                        onClick={() => handleUpdate(order.OrderID)}
                        disabled={order.OrderStatus === 1}
                        className={`px-4 py-1 rounded-md font-semibold ${
                          order.OrderStatus === 0
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {order.OrderStatus === 0 ? "Pending..." : "Confirmed"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No orders found
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

export default Order;
