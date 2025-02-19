"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateCategory from "./CreateCategory";

const Categories = () => {
  const [isModel, setIsModel] = useState(false);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("/api/category"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setCategory(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching category.");
        }
      } catch (err) {
        setError("Failed to fetch category data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    const interval = setInterval(fetchCategory, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isModel]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = async (categoryID) => {
    if (!categoryID) return; // Ensure ID exists before making a request
    try {
      const response = await fetch(`/api/category/${categoryID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      setCategory((prevcategory) =>
        prevcategory.filter((s) => s.CategoryID !== categoryID)
      ); // Remove deleted staff from list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="flex">
      <NavBar />
      <div className="flex flex-col">
        <div>
          <div>Categories</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreateCategory setIsModel={setIsModel} />
          </div>
        )}
        <div>
          {category.length === 0 ? (
            <p>No Category available</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {category.map((cat) => (
                <div
                  key={cat.CategoryID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>name:{cat.CategoryName}</p>

                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(cat.CategoryID)}
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

export default Categories;
