import Link from "next/link";
import React from "react";

export const MainMenu = () => {
  return (
    <div className="flex h-[728px] ">
      <div className="bg-[#FFD2A2] flex justify-end flex-col w-[70%] h-full p-14">
        <p className="text-[110px] font-semibold">Fashion Fluent</p>
        <p className="text-[30px] font-semibold">Admin Dashboard</p>
      </div>
      <div className="flex h-full flex-col gap-10 justify-center items-center w-[30%]">
        <Link
          href={{ pathname: "/SignIn", query: { role: "Admin" } }}
          className="border-2 border-[#4C4135] py-3 px-6 rounded-md text-[20px] bg-[#E2B380] font-semibold hover:bg-[#e7c7a5] hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Sign In As Admin
        </Link>
        <Link
          href={{ pathname: "/SignIn", query: { role: "Staff" } }}
          className="border-2 border-[#4C4135] py-3 px-8 rounded-md text-[20px] bg-[#E2B380] font-semibold hover:bg-[#e7c7a5] hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Sign In As Staff
        </Link>
      </div>
    </div>
  );
};
