"use client";
import React from "react";
import CreateProduct from "../../components/CreateProduct";
import { NavBar } from "../../components/commoms/NavBar";

const page = () => {
  return (
    <div className="flex">
      <NavBar />
      <CreateProduct />
    </div>
  );
};

export default page;
