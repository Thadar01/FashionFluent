"use client";
import Image from "next/image";
import React from "react";

export const MainDashBoard = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const data = [
    "Staff",
    "Purchase Products",
    "Inventory",
    "Manage Products",
    "Order Confirmation",
    "Promotions",
    "Customers",
    "Feedbacks",
  ];
  return (
    <div className="bg-[#FFD2A2] bg-opacity-50 w-[16%] h-[725px]">
      <div className="flex flex-row gap-7 p-3 border-x-0 border-t-0 border-b-2 border-black border-opacity-15">
        <Image
          src={"/assets/profile.png"}
          width={50}
          height={50}
          alt="profile"
        />
        <div className="font-semibold">
          <h1 className="text-[20px]">{userData.name}</h1>
          <h1 className="text-[14px]">{userData.role}</h1>
        </div>
      </div>
      {data.map((item, index) => (
        <button
          key={index}
          className="p-5 pl-6 text-[20px] font-semibold border-x-0 border-t-0 border-b-2 border-black border-opacity-15 w-full text-left hover:bg-[#bca081]"
        >
          {item}
        </button>
      ))}
    </div>
  );
};
