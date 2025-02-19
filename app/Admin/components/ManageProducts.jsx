"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageProducts = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleClick = () => {
    router.push("/Admin/MainDashboard/Products");
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setProduct(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching product.");
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleDelete = async (productID) => {
    if (!productID) return; // Ensure ID exists before making a request
    try {
      const response = await fetch(`/api/product/${productID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProduct((prevproduct) =>
        prevproduct.filter((s) => s.ProductID !== productID)
      ); // Remove deleted product from list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="flex">
      <NavBar />
      <div>
        <h1>Manage Product</h1>
        <button onClick={() => handleClick()}>Add</button>
        <div>
          {product.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {product.map((p) => (
                <div
                  key={p.ProductID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>Title:{p.ProductTitle}</p>
                  <p>Price:{p.ProductPrice}</p>
                  <p>Gender:{p.Gender}</p>
                  <p>Color:{p.ProductColors}</p>
                  <p>Stock:{p.Stock}</p>
                  <Image
                    src={p.Image}
                    width={50}
                    height={50}
                    alt={p.ProductTitle}
                  />
                  <p>Category:{p.CategoryID}</p>
                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(p.ProductID)}
                  >
                    Delete
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
