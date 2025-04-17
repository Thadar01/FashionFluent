"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { redirect, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";

const ProductDetails = () => {
  const Params = useSearchParams();
  const productID = Params.get("productID");
  const [product, setProduct] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [number, setNumber] = useState(1);
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/product?productID=${productID}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      const productData = data[0];

      setProduct(productData);

      // Fetch promotion if the product has a PromotionID
      if (productData.PromotionID) {
        fetchPromotion(productData.PromotionID);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchPromotion = async (promotionID) => {
    try {
      const res = await fetch(`/api/promotion?promotionID=${promotionID}`);
      if (!res.ok) throw new Error("Failed to fetch promotion");
      const data = await res.json();
      setPromotion(data[0]);
    } catch (err) {
      console.error("Error fetching promotion:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productID) return;
    fetchProduct();
  }, [productID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  // Calculate Discount Price if promotion is available
  const discountPrice =
    promotion && product.ProductPrice
      ? product.ProductPrice * (1 - promotion.PromotionPercent / 100)
      : null;

  // Convert colors string into an array
  const colorsArray = product.ProductColors
    ? product.ProductColors.split(",").map((color) => color.trim())
    : [];

  const sizeArray = product.Sizes
    ? product.Sizes.split(",").map((size) => size.trim())
    : [];

  const formatEndDate = (dateString) => {
    const [day, month, year] = dateString.split("/"); // Extract day, month, year
    return new Date(`${year}-${month}-${day}`).setHours(0, 0, 0, 0); // Convert to timestamp
  };
  const today = new Date().setHours(0, 0, 0, 0); // Get today's timestamp

  const handleAddToCart = () => {
    if (!session) {
      alert("Please register first.");
      redirect("/User/SignIn");
      return;
    }
    if (!product) return;

    if (selectedColor === "") {
      window.alert("Please Select the desired color");
    } else if (selectedSize === "") {
      window.alert("Please select the size");
    } else {
      const cartProduct = {
        id: product.ProductID,
        title: product.ProductTitle,
        price: discountPrice ?? product.ProductPrice,
        image: product.Image,
        quantity: number, // Current quantity selected
        stock: product.Stock,
        selectedColor,
        selectedSize,
      };

      addToCart(cartProduct); // Add to cart
      console.log(cartProduct);
    }
  };
  return (
    <div>
      <NavBar />
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:h-screen px-4 lg:px-6">
        {" "}
        {/* Left Side: Product Image */}
        {console.log(promotion)}
        <div className="w-full lg:w-[40%] h-full flex justify-center">
          {" "}
          <Image
            src={product.Image}
            width={200}
            height={200}
            alt={product.ProductTitle}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right Side: Product Details */}
        <div className=" w-full lg:w-[60%] flex flex-col justify-center items-center ">
          <div className="flex flex-col w-full lg:w-[70%] gap-4">
            <h1 className="text-[90px]">{product.ProductTitle}</h1>
            <p className="text-[20px] text-gray-500">
              Price: {product.ProductPrice} MMK
            </p>
            {console.log("end date", formatEndDate(promotion.EndDate))}
            {console.log("Today's Date:", new Date().setHours(0, 0, 0, 0))}{" "}
            {/* Display Promotion if available */}
            {promotion.PromotionID !== "Pro-001" &&
              formatEndDate(promotion.EndDate) >= today && (
                <div className="bg-yellow-300 p-3 rounded-md">
                  <h2 className="text-xl font-bold">
                    {promotion.PromotionTitle} {promotion.PromotionPercent}%
                    Discount Available!
                  </h2>
                  <p>{promotion.PromoDes}</p>
                  {/* Show Discount Price */}
                  <p className=" font-bold">
                    Discount Price: {discountPrice} MMK
                  </p>
                </div>
              )}
            <p className="text-gray-500">Description: {product.Description}</p>
            {/* Color Selection */}
            <div className="flex items-center gap-5">
              <h3 className="mt-4 text-lg font-semibold">Colors:</h3>
              {colorsArray.length > 0 ? (
                <div className="flex gap-3 mt-2">
                  {colorsArray.map((color, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-500"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              ) : (
                <p>No colors available</p>
              )}
            </div>
            {/* Size Selection */}
            <div className="flex items-center gap-5">
              <h3 className="mt-4 text-lg font-semibold">Sizes:</h3>
              {sizeArray.length > 0 ? (
                <div className="flex gap-3 mt-2">
                  {sizeArray.map((size, index) => (
                    <div
                      key={index}
                      className={`rounded-md border-2 cursor-pointer transition-all text-center px-3 py-1 ${
                        selectedSize === size
                          ? "border-black scale-110"
                          : "border-gray-400"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No sizes available</p>
              )}
            </div>
            {/* Quantity Selection */}
            <div className="flex gap-3 mt-5">
              <div className="flex border-2 border-gray-400 py-1 w-[20%] lg:w-[15%] justify-around">
                <button
                  onClick={() => setNumber((prevNumber) => prevNumber - 1)}
                  disabled={number <= 1}
                  className={`${
                    number <= 1
                      ? "cursor-not-allowed text-gray-500"
                      : "text-black text-center"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 27 27"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>

                <p className="text-[20px]">{number}</p>

                <button
                  onClick={() => setNumber((prevNumber) => prevNumber + 1)}
                  disabled={number >= product.Stock}
                  className={`${
                    number >= product.Stock
                      ? "cursor-not-allowed text-gray-500"
                      : "text-black"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 27 27"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white p-3 w-[70%]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
