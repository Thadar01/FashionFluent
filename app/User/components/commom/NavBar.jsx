"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const [isProductDD, setIsProductDD] = useState(false);
  const [isInfoDD, setIsInfoDD] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const { data: session, status } = useSession();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="bg-[#FFFAF4] h-[70px] flex  items-center gap-10 sticky top-0 z-50">
      <div className="ml-4 mt-1">
        <Image
          src="/assets/logo.png"
          width={50}
          height={50} // Match parent height
          className="rounded-full object-contain"
          alt="Logo"
        />
      </div>
      <button
        onClick={toggleMenu}
        className="lg:hidden focus:outline-none md:hidden"
        aria-label="Toggle Menu"
      >
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="flex flex-col bg-white w-full absolute top-12 gap-10 items-center justify-center pb-10 md:hidden lg:hidden">
          {/* Your content here */}
          <Link
            href={"/User"}
            className={`relative w-[10%] mt-10 after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
              pathname === "/User"
                ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Home
          </Link>
          <div className="flex gap-2 relative w-[85px] ">
            <Link
              href={"/User/Products"}
              className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
                pathname === "/User/Products"
                  ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                  : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
              }`}
            >
              Products
            </Link>
            <button onClick={() => setIsProductDD(!isProductDD)}>
              {isProductDD ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute top-2 right-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute top-2 right-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
            </button>
            {/*Product Drop Down Box */}
            {isProductDD && (
              <div className="bg-white flex flex-col absolute top-8 border-2 border-gray-200 h-[80px] w-full  items-center left-10">
                <Link
                  href={" "}
                  className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px]  hover:bg-gray-300"
                >
                  Men
                </Link>
                <Link
                  href={""}
                  className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px] hover:bg-gray-300"
                >
                  Women
                </Link>
                <Link
                  href={""}
                  className="hover:bg-gray-300 w-full text-center"
                >
                  UniSex
                </Link>
              </div>
            )}
          </div>
          <Link
            href={""}
            className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
              pathname === "/User/Feedbacks"
                ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Feedbacks
          </Link>
          <div className="flex gap-2 relative w-[50px] ">
            <Link
              href={""}
              className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
                pathname === "/User/Info"
                  ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                  : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
              }`}
            >
              Info
            </Link>
            <button onClick={() => setIsInfoDD(!isInfoDD)}>
              {isInfoDD ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute top-2 right-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 absolute top-2 right-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
            </button>

            {isInfoDD && (
              <div className="bg-white flex flex-col absolute top-8 border-2 border-gray-200 h-[90px] w-[120px]  items-center left-10">
                <Link
                  href={" "}
                  className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px]  hover:bg-gray-300"
                >
                  About Us
                </Link>
                <Link
                  href={""}
                  className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px] hover:bg-gray-300"
                >
                  Q&A
                </Link>
                <Link
                  href={""}
                  className="hover:bg-gray-300 w-full text-center"
                >
                  Privacy/Policy
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <div className=" gap-11 hidden sm:flex">
        <Link
          href={"/User"}
          className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
            pathname === "/User"
              ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
              : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
          }`}
        >
          Home
        </Link>
        <div className="flex gap-2 relative w-[85px] ">
          <Link
            href={"/User/Products"}
            className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
              pathname === "/User/Products"
                ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Products
          </Link>
          <button onClick={() => setIsProductDD(!isProductDD)}>
            {isProductDD ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 absolute top-2 right-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 absolute top-2 right-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </button>
          {/*Product Drop Down Box */}
          {isProductDD && (
            <div className="bg-white flex flex-col absolute top-8 border-2 border-gray-200 h-[80px] w-full  items-center left-10">
              <Link
                href={{ pathname: "/User/Products", query: { gender: "Male" } }}
                className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px]  hover:bg-gray-300"
              >
                Men
              </Link>
              <Link
                href={{
                  pathname: "/User/Products",
                  query: { gender: "Female" },
                }}
                className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px] hover:bg-gray-300"
              >
                Women
              </Link>
              <Link
                href={{
                  pathname: "/User/Products",
                  query: { gender: "Unisex" },
                }}
                className="hover:bg-gray-300 w-full text-center"
              >
                UniSex
              </Link>
            </div>
          )}
        </div>
        <Link
          href={""}
          className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
            pathname === "/User/Feedbacks"
              ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
              : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
          }`}
        >
          Feedbacks
        </Link>
        <div className="flex gap-2 relative w-[50px] ">
          <Link
            href={""}
            className={`relative after:block after:content-[''] after:absolute after:left-0 after:w-full after:h-[2px] after:bottom-[-4px] after:transition-transform after:duration-300 ${
              pathname === "/User/Info"
                ? "after:bg-[#FFD2A2] after:scale-x-100" // Active link underline
                : "after:bg-[#FFD2A2] after:scale-x-0 hover:after:scale-x-100"
            }`}
          >
            Info
          </Link>
          <button onClick={() => setIsInfoDD(!isInfoDD)}>
            {isInfoDD ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 absolute top-2 right-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 absolute top-2 right-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </button>

          {isInfoDD && (
            <div className="bg-white flex flex-col absolute top-8 border-2 border-gray-200 h-[90px] w-[120px]  items-center left-10">
              <Link
                href={" "}
                className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px]  hover:bg-gray-300"
              >
                About Us
              </Link>
              <Link
                href={""}
                className="border-x-0 border-t-0 border-b-2 border-gray-200 w-full text-center h-[30px] hover:bg-gray-300"
              >
                Q&A
              </Link>
              <Link href={""} className="hover:bg-gray-300 w-full text-center">
                Privacy/Policy
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex absolute right-3 gap-3 items-center sm:w-[30%] justify-end mr-2 ">
        {/* Sign In Link (Always Visible) */}
        {/* Cart Icon (Always Visible) */}
        <Link href="/User/Cart">
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
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </Link>

        {/* Search Input and Icon */}
        <div className="relative">
          {/* Search Input (Hidden on Small Screens) */}
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 w-full rounded-lg sm:block hidden" // Hidden on small screens
          />
          {/* Search Icon (Visible on Small Screens) */}
          <button
            className="sm:hidden focus:outline-none"
            onClick={() => {
              // Add logic to toggle search input visibility on small screens
              const searchInput = document.querySelector("input[type='text']");
              searchInput?.classList.toggle("hidden");
              searchInput?.focus();
            }}
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          {/* Search Icon Inside Input (Visible on Medium and Larger Screens) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500 sm:block hidden" // Hidden on small screens
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {status === "authenticated" ? (
          <button
            onClick={() => signOut({ callbackUrl: "/User" })}
            className="md:w-[40%] lg:w-[20%] relative border-2 border-[#5A4A2A] py-1 rounded-xl hover:bg-[#CFB191]"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/User/SignIn"
            className="md:w-[40%] lg:w-[20%] relative border-2 border-[#5A4A2A] py-1 rounded-xl hover:bg-[#CFB191] text-center"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
