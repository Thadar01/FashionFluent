"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <div className="bg-[#FFFAF4] w-full flex flex-col gap-7 py-4">
      {/* Columns Container */}
      <div className="flex flex-col gap-10 sm:flex-row sm:justify-around sm:gap-4">
        {/* Shop Column */}
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h2 className="text-gray-600 text-[18px] font-semibold">Shop</h2>
          <Link
            href={{ pathname: "/User/Products", query: { gender: "Male" } }}
            className="hover:underline"
          >
            Men
          </Link>
          <Link
            href={{
              pathname: "/User/Products",
              query: { gender: "Female" },
            }}
            className="hover:underline"
          >
            Women
          </Link>
          <Link
            href={{
              pathname: "/User/Products",
              query: { gender: "Unisex" },
            }}
            className="hover:underline"
          >
            Unisex
          </Link>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h2 className="text-gray-600 text-[18px] font-semibold">Company</h2>
          <Link href={"/User/AboutUs"} className="hover:underline">
            About Us
          </Link>
          <Link href={"/User/QA"} className="hover:underline">
            Q&A
          </Link>
          <Link href={"/User/PrivacyPolicy"} className="hover:underline">
            Privacy & Policy
          </Link>
        </div>

        {/* Contact Us Column */}
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h2 className="text-gray-600 text-[18px] font-semibold">
            Contact Us
          </h2>
          <div className="flex gap-2 justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <p className="text-blue-500 underline cursor-pointer">
              fashionfluent@gmail.com
            </p>
          </div>
          <div className="flex gap-2 justify-center sm:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <p>+959647352267</p>
          </div>
          <div className="flex gap-4 justify-center sm:justify-start mt-4">
            <Link href={"https://www.facebook.com/"}>
              <Image
                src={"/assets/facebook.svg"}
                width={30}
                height={30}
                alt="facebook"
              />
            </Link>
            <Link href={"https://www.instagram.com/accounts/login/?hl=en"}>
              <Image
                src={"/assets/instagram.svg"}
                width={30}
                height={30}
                alt="instagram"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Text */}
      <p className="text-gray-500 p-3 text-center sm:text-left">
        &copy; 2025 Fashion Fluent. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
