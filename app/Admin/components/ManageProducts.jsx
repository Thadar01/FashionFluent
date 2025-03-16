"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageProducts = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
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
          fetch("/api/category"), // Fetch categories
          fetch("/api/promotion"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const promoData = await promoRes.json();

        if (productRes.ok && categoryRes.ok) {
          setProduct(productData);
          setFilteredProducts(productData);
          setCategories(categoryData); // Save categories in state
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
    // Filter products based on search query
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

      setProduct((prevProducts) =>
        prevProducts.filter((p) => p.ProductID !== productID)
      );
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/Admin/MainDashboard/EditProduct?id=${id}`);
  };

  // Function to get category name from category list
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.CategoryID === categoryId);
    return category ? category.CategoryName : "Unknown";
  };

  const getPromotionName = (promoId) => {
    const promotion = promotions.find((c) => c.PromotionID === promoId);
    return promotion ? promotion.PromotionTitle : "Unknown";
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <NavBar />
      <div className="p-4 w-full">
        <div className="w-full flex justify-between">
          <h1 className="text-[30px] font-semibold">Products</h1>
          <button
            className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
            onClick={handleClick}
          >
            Add
          </button>
        </div>
        {/* Search Input */}
        <div className="relative w-[20%] my-3">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 w-full rounded-lg"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-3 top-5 transform -translate-y-1/2 size-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div className="flex w-full justify-center items-center">
          {filteredProducts.length === 0 ? (
            loading ? (
              <p className="p-4">loading...</p>
            ) : (
              <p className="p-4">No Product available</p>
            )
          ) : (
            <div className="flex flex-wrap gap-10 w-full  ">
              {filteredProducts.map((p) => (
                <div
                  key={p.ProductID}
                  className="border-2 border-black rounded-xl p-2 flex flex-col justify-center items-center gap-5 w-[20%]"
                >
                  <div className="w-[150px] h-[200px] bg-red-400">
                    <Image
                      src={p.Image}
                      alt={p.ProductTitle}
                      width={100}
                      height={100}
                      style={{ width: "100%", height: "100%" }} // Ensures it fits inside the div
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <p>Title: {p.ProductTitle}</p>
                    <p>Description:{p.Description}</p>
                    <p>Price: {p.ProductPrice} MMK</p>
                    <p>Gender: {p.Gender}</p>
                    <p>Color: {p.ProductColors}</p>
                    <p>Sizes:{p.Sizes}</p>
                    <p>Stock: {p.Stock}</p>
                    <p>Category: {getCategoryName(p.CategoryID)}</p>
                    <p>Promotion:{getPromotionName(p.PromotionID)}</p>
                  </div>

                  <div className="w-full flex justify-around items-center mb-2">
                    <button
                      className="bg-white bg-opacity-60 w-[45%] h-[35px] border-2 border-black rounded-xl hover:bg-slate-500 hover:bg-opacity-30 font-semibold"
                      onClick={() => handleEdit(p.ProductID)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-400 w-[45%] h-[35px] border-2 border-black rounded-xl hover:bg-red-500 font-semibold"
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
    </div>
  );
};

export default ManageProducts;
