"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageProducts = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = () => {
    router.push("/Admin/MainDashboard/Products");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();

        if (response.ok) {
          setProduct(data);
          setFilteredProducts(data);
        } else {
          setError(data.error || "An error occurred while fetching products.");
        }
      } catch (err) {
        setError("Failed to fetch product data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
        <input
          type="text"
          placeholder="Search products..."
          className="border-2 border-gray-300 p-2 rounded-md mb-4 w-[20%]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex w-full justify-center items-center">
          {filteredProducts.length === 0 ? (
            loading ? (
              <p className="p-4">loading...</p>
            ) : (
              <p className="p-4">No Product available</p>
            )
          ) : (
            <div className="flex flex-wrap gap-10 w-full  justify-between">
              {filteredProducts.map((p) => (
                <div
                  key={p.ProductID}
                  className="border-2 border-black rounded-xl p-2 flex flex-col justify-center items-center gap-5 w-[20%]"
                >
                  <Image
                    src={p.Image}
                    width={100}
                    height={100}
                    alt={p.ProductTitle}
                  />
                  <div className="w-full">
                    <p>Title: {p.ProductTitle}</p>
                    <p>Price: {p.ProductPrice}</p>
                    <p>Gender: {p.Gender}</p>
                    <p>Color: {p.ProductColors}</p>
                    <p>Stock: {p.Stock}</p>

                    <p>Category: {p.CategoryID}</p>
                  </div>

                  <div className="w-full flex justify-around items-center">
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
