"use client";
import React from "react";
import CreateProduct from "../../components/CreateProduct";
import { NavBar } from "../../components/commoms/NavBar";

const page = () => {
  return (
    <div className="flex">
      <div className="w-[16%]">
        <NavBar />
      </div>{" "}
      <CreateProduct />
    </div>
  );
};

export default page;
