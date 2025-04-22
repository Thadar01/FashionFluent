"use client";
import React, { useEffect, useState } from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";

const MainDashBoard = () => {
  const { data: session } = useSession();
  const [summary, setSummary] = useState({
    staff: 0,
    customers: 0,
    suppliers: 0,
    pendingOrders: 0,
    products: 0,
    deliveries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="flex">
      <div className="w-[13.5%]">
        <NavBar />
      </div>
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h1>

        {loading ? (
          <div className="mt-10 text-center text-lg text-gray-500">
            <div className="animate-spin rounded-full border-t-2 border-blue-500 w-8 h-8"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Total Staffs</h2>
              <p className="text-3xl font-bold mt-2">{summary.staff}</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Total Customers</h2>
              <p className="text-3xl font-bold mt-2">{summary.customers}</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Total Suppliers</h2>
              <p className="text-3xl font-bold mt-2">{summary.suppliers}</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Pending Orders</h2>
              <p className="text-3xl font-bold mt-2">{summary.pendingOrders}</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Total Products</h2>
              <p className="text-3xl font-bold mt-2">{summary.products}</p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-lg font-semibold">Total Delivery Regions</h2>
              <p className="text-3xl font-bold mt-2">{summary.deliveries}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashBoard;
