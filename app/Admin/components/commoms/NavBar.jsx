"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const data = [
    "Staff",
    "Suppliers",
    "Categories",
    "Delivery",
    "Promotions",
    "Manage Products",
    "Purchase Products",
    "Order Confirmation",
    "Customers",
    "Feedbacks",
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (status === "unauthenticated") {
    return null; // Prevents rendering the rest of the component
  }

  const handleClick = (index) => {
    if (index === 0) {
      router.push("/Admin/MainDashboard");
    } else {
      const item = data[index];
      const pathName = `/Admin/MainDashboard/${item.replace(/\s+/g, "")}`;
      router.push(pathName);
      console.log(pathName);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/Admin" });
  };

  return (
    <div className="bg-[#FFD2A2] bg-opacity-50 w-[16%] h-[725px] sticky top-0">
      {/* Profile Section */}
      <div className="flex flex-row gap-7 p-3 border-x-0 border-t-0 border-b-2 border-black border-opacity-15">
        <Image
          src={"/assets/profile.png"}
          width={50}
          height={50}
          alt="profile"
        />
        <div className="font-semibold">
          <h1 className="text-[20px]">{session.user.name}</h1>
          <h1 className="text-[14px]">{session.user.role}</h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      {data.map((item, index) => (
        <button
          key={index}
          className="p-5 pl-6 py-4 text-[14px] font-semibold border-x-0 border-t-0 border-b-2 border-black border-opacity-15 w-full text-left hover:bg-[#bca081]"
          onClick={() => handleClick(index)}
        >
          {item}
        </button>
      ))}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-white w-[40%] h-[80px] border-2 border-black absolute bottom-7 left-20 transform -translate-x-1/2 z-3 mb-3 rounded-2xl flex flex-col justify-around transition-transform">
          <button className="text-left pl-3 hover:bg-gray-300 h-[50%] rounded-t-2xl border-t-0 border-x-0 border-b-2 border-gray-700">
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-left pl-3 hover:bg-gray-300 h-[50%] rounded-b-2xl"
          >
            Log out
          </button>
        </div>
      )}

      {/* Settings Button */}
      <button
        className="absolute bottom-1 left-5 transform -translate-x-1/2 z-3 mb-3"
        onClick={() => setOpen(!isOpen)}
      >
        <Image
          src={"/assets/Settings.png"}
          height={20}
          width={20}
          alt="setting"
        />
      </button>
    </div>
  );
};
