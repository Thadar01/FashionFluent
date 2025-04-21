"use client";
import React from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";

const MainDashBoard = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex">
      <div className="w-[13.5%]">
        <NavBar />
      </div>
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h1>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold">Total Staff</h2>
            <p className="text-3xl font-bold mt-2">1,200</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold">Total Customers</h2>
            <p className="text-3xl font-bold mt-2">45</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold">Total Supplier</h2>
            <p className="text-3xl font-bold mt-2">32</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;
