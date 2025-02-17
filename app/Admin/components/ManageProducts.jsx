"use client";
import React from "react";
import { NavBar } from "./commoms/NavBar";
import CreateProduct from "./CreateProduct";
import { useRouter } from "next/navigation";

const ManageProducts = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/Admin/MainDashboard/Products");
  };
  return (
    <div className="flex">
      <NavBar />
      <div>
        <h1>Manage Product</h1>
        <button onClick={() => handleClick()}>Add</button>
      </div>
    </div>
  );
};

export default ManageProducts;
