"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageProducts = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotion] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = () => {
    router.push("/Admin/MainDashboard/Products");
  };

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productRes, categoryRes, promoRes] = await Promise.all([
          fetch("/api/product"),
          fetch("/api/category"),
          fetch("/api/promotion"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const promoData = await promoRes.json();

        if (productRes.ok && categoryRes.ok && promoRes.ok) {
          setProduct(productData);
          setFilteredProducts(productData);
          setCategories(categoryData);
          setPromotion(promoData);
        } else {
          setError("An error occurred while fetching data.");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, []);

  useEffect(() => {
    const filtered = product.filter((p) =>
      p.ProductTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, product]);

  const handleDelete = async (productID) => {
    if (!productID) return;

    try {
      const response = await fetch(`/api/product/${productID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProduct((prev) => prev.filter((p) => p.ProductID !== productID));
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/Admin/MainDashboard/EditProduct?id=${id}`);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.CategoryID === categoryId);
    return category ? category.CategoryName : "Unknown";
  };

  const getPromotionName = (promoId) => {
    const promo = promotions.find((p) => p.PromotionID === promoId);
    return promo ? promo.PromotionTitle : "Unknown";
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <div className="w-[16%]">
        <NavBar />
      </div>
      <div className="p-4 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[30px] font-semibold">Products</h1>
          <button
            className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
            onClick={handleClick}
          >
            Add
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-[20%] mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 w-full rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-3 top-3.5 size-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="p-4">No Product available</p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.ProductID}
                className="border-2 border-black rounded-xl p-3 flex flex-col items-center gap-3"
              >
                <div className="w-full h-[300px] ">
                  <Image
                    src={p.Image}
                    alt={p.ProductTitle}
                    width={100}
                    height={100}
                    style={{ width: "100%", height: "100%" }}
                    className="object-cover"
                  />
                </div>
                <div className="w-full text-sm">
                  <p>Title: {p.ProductTitle}</p>
                  <p>Description: {p.Description}</p>
                  <p>Price: {p.ProductPrice} MMK</p>
                  <p>Gender: {p.Gender}</p>
                  <p>Color: {p.ProductColors}</p>
                  <p>Sizes: {p.Sizes}</p>
                  <p>Stock: {p.Stock}</p>
                  <p>Category: {getCategoryName(p.CategoryID)}</p>
                  <p>Promotion: {getPromotionName(p.PromotionID)}</p>
                </div>
                <div className="w-full flex justify-between gap-2 mt-auto">
                  <button
                    className="bg-white bg-opacity-60 flex-1 h-[35px] border-2 border-black rounded-xl hover:bg-slate-500 hover:bg-opacity-30 font-semibold"
                    onClick={() => handleEdit(p.ProductID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-400 flex-1 h-[35px] border-2 border-black rounded-xl hover:bg-red-500 font-semibold"
                    onClick={() => handleDelete(p.ProductID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
