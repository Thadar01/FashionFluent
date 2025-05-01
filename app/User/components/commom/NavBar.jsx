"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";

const NavBar = () => {
  const pathname = usePathname();
  const [isProductDD, setIsProductDD] = useState(false);
  const [product, setProduct] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInfoDD, setIsInfoDD] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const { data: session, status } = useSession();
  const { cartItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productRes] = await Promise.all([fetch("/api/product")]);
        const productData = await productRes.json();
        console.log("Fetched products:", productData);

        if (productRes.ok) {
          setProduct(productData);
        } else {
          console.log("An error occurred while fetching data.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductAndCategories();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = product.filter((item) =>
      item.ProductTitle?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
    console.log("result", results);
  };

  return (
    <div className="bg-[#FFFAF4] h-[70px] flex items-center justify-between sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <div className="mr-4 mt-1">
          <Image
            src="/assets/logo.png"
            width={50}
            height={50}
            className="rounded-full object-contain"
            alt="Logo"
          />
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none"
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
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-2 flex flex-col items-center gap-4 z-50 lg:hidden">
            <Link
              href={"/User"}
              className={
                pathname === "/User"
                  ? "text-[#FFD2A2] font-semibold"
                  : "hover:text-[#FFD2A2]"
              }
            >
              Home
            </Link>
            <div className="relative">
              <Link href={"/User/Products"}>Product</Link>
              <button
                onClick={() => setIsProductDD(!isProductDD)}
                className="flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-4 transition-transform ${
                    isProductDD ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isProductDD && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-sm mt-1 w-full">
                  <Link
                    href={{
                      pathname: "/User/Products",
                      query: { gender: "Male" },
                    }}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    Men
                  </Link>
                  <Link
                    href={{
                      pathname: "/User/Products",
                      query: { gender: "Female" },
                    }}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    Women
                  </Link>
                  <Link
                    href={{
                      pathname: "/User/Products",
                      query: { gender: "Unisex" },
                    }}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    UniSex
                  </Link>
                </div>
              )}
            </div>
            <Link
              href={"/User/OrderHistory"}
              className={
                pathname === "/User/OrderHistory"
                  ? "text-[#FFD2A2] font-semibold"
                  : "hover:text-[#FFD2A2]"
              }
            >
              Order History
            </Link>
            <Link
              href={"/User/Feedbacks"}
              className={
                pathname === "/User/Feedbacks"
                  ? "text-[#FFD2A2] font-semibold"
                  : "hover:text-[#FFD2A2]"
              }
            >
              Feedbacks
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsInfoDD(!isInfoDD)}
                className="flex items-center gap-1"
              >
                Info
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-4 transition-transform ${
                    isInfoDD ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isInfoDD && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-sm mt-1 w-full">
                  <Link
                    href={"/User/AboutUs"}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    About Us
                  </Link>
                  <Link
                    href={"/User/QA"}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    Q&A
                  </Link>
                  <Link
                    href={"/User/PrivacyPolicy"}
                    className="block py-2 px-4 hover:bg-gray-100"
                  >
                    Privacy/Policy
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Desktop Navigation Links */}
        <div className="gap-10 hidden lg:flex">
          <Link
            href={"/User"}
            className={
              pathname === "/User"
                ? "text-[#FFD2A2] font-semibold"
                : "hover:text-[#FFD2A2]"
            }
          >
            Home
          </Link>
          <div className="relative flex gap-1">
            <Link href={"/User/Products"}>Product</Link>

            <button
              onClick={() => setIsProductDD(!isProductDD)}
              className="flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-4 transition-transform ${
                  isProductDD ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {isProductDD && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-sm mt-1 w-32">
                <Link
                  href={{
                    pathname: "/User/Products",
                    query: { gender: "Male" },
                  }}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  Men
                </Link>
                <Link
                  href={{
                    pathname: "/User/Products",
                    query: { gender: "Female" },
                  }}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  Women
                </Link>
                <Link
                  href={{
                    pathname: "/User/Products",
                    query: { gender: "Unisex" },
                  }}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  UniSex
                </Link>
              </div>
            )}
          </div>
          <Link
            href={"/User/OrderHistory"}
            className={
              pathname === "/User/OrderHistory"
                ? "text-[#FFD2A2] font-semibold"
                : "hover:text-[#FFD2A2]"
            }
          >
            Order History
          </Link>
          <Link
            href={"/User/Feedbacks"}
            className={
              pathname === "/User/Feedbacks"
                ? "text-[#FFD2A2] font-semibold"
                : "hover:text-[#FFD2A2]"
            }
          >
            Feedbacks
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsInfoDD(!isInfoDD)}
              className="flex items-center gap-1"
            >
              Info
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-4 transition-transform ${
                  isInfoDD ? "rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {isInfoDD && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-sm mt-1 w-32">
                <Link
                  href={"/User/AboutUs"}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  About Us
                </Link>
                <Link
                  href={"/User/QA"}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  Q&A
                </Link>
                <Link
                  href={"/User/PrivacyPolicy"}
                  className="block py-2 px-4 hover:bg-gray-100"
                >
                  Privacy/Policy
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input and Icon */}
        <Link href="/User/Cart" className="relative">
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
          {cartItems.length > 0 && (
            <p className="bg-red-400 text-center rounded-full text-[10px] w-5 h-5 flex items-center justify-center absolute bottom-4 left-3">
              {cartItems.length}
            </p>
          )}
        </Link>
        <div className="relative sm:block hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border px-3 py-1 rounded-md sm:w-auto w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full z-50 flex flex-col justify-start items-start gap-3">
              {searchResults.map((item) => (
                <Link
                  key={item.ProductID}
                  href={{
                    pathname: "/User/ProductDetails",
                    query: { productID: item.ProductID },
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer w-full flex items-center gap-3 text-[13px]"
                >
                  <Image
                    src={item.Image}
                    width={50}
                    height={50}
                    alt={item.ProductTitle}
                    className="rounded-lg"
                  />
                  {item.ProductTitle}
                </Link>
              ))}
            </div>
          )}
        </div>

        {status === "authenticated" ? (
          <svg
            onClick={() => signOut({ callbackUrl: "/User" })}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer text-red-400"
            title="Logout"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        ) : (
          <Link
            href="/User/SignIn"
            className="border-2 border-[#5A4A2A] py-1 px-3 rounded-xl hover:bg-[#CFB191] text-center text-sm"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
