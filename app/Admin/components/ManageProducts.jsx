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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          className="border-2 border-gray-300 p-2 rounded-md mb-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add Product
        </button>

        <div>
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {filteredProducts.map((p) => (
                <div
                  key={p.ProductID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>Title: {p.ProductTitle}</p>
                  <p>Price: {p.ProductPrice}</p>
                  <p>Gender: {p.Gender}</p>
                  <p>Color: {p.ProductColors}</p>
                  <p>Stock: {p.Stock}</p>
                  <Image
                    src={p.Image}
                    width={50}
                    height={50}
                    alt={p.ProductTitle}
                  />
                  <p>Category: {p.CategoryID}</p>
                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(p.ProductID)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleEdit(p.ProductID)}
                  >
                    Edit
                  </button>
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
