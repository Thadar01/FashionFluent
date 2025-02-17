"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "./commoms/NavBar";

const Suppliers = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/MainDashboard/Suppliers/CreateSupplier");
  };
  return (
    <div className="flex">
      <NavBar />
      <h1>Suppliers</h1>
      <button className="bg-blue-300 h-10" onClick={() => handleClick()}>
        Create
      </button>
    </div>
  );
};

export default Suppliers;
