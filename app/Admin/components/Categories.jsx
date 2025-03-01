"use client";
import React, { useState, useEffect, useRef } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";

const Categories = () => {
  const [isModel, setIsModel] = useState(false);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(null); // New state to store the category ID

  const fetchCategory = async () => {
    try {
      const response = await fetch("/api/category"); // Call the GET route
      const data = await response.json();

      if (response.ok) {
        setCategory(data); // Store the category data in state
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

  useEffect(() => {
    fetchCategory();
    const interval = setInterval(fetchCategory, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isModel]);

  useEffect(() => {
    if (searchTerm === "") {
      fetchCategory(); // Refetch all categories when search input is cleared
      return;
    }

    const fetchSearchedCategory = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/category?q=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
          setCategory(data);
          setError(null);
        } else {
          setError(data.error || "An error occurred while searching category.");
        }
      } catch (err) {
        setError("Failed to search category data");
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchedCategory();
  }, [searchTerm]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [category]);

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

      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat.CategoryID !== categoryID)
      ); // Remove deleted category from the list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (categoryID) => {
    setCategoryId(categoryID); // Store the ID of the category to be edited
    setEdit(true); // Show the Edit form
  };

  return (
    <div>
      <div className={`flex ${isModel || edit ? "filter blur-sm" : ""}`}>
        <NavBar />
        <div className="w-full m-4 flex flex-col gap-4">
          {/* Background Content (will be blurred when model is open) */}
          <div className="w-full flex justify-between">
            <h1 className="text-[30px] font-semibold">Categories</h1>
            <button
              className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
              onClick={() => setIsModel(!isModel)}
            >
              Add
            </button>
          </div>
          <div>
            {searchLoading && <p>Searching...</p>}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 my-3 w-[20%]"
            />
          </div>
          <div className="w-[50%]">
            <div className="grid grid-cols-1 w-[70%]">
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Category Name
              </div>
            </div>
            {category.length === 0 ? (
              loading ? (
                <p className="p-4">loading...</p>
              ) : (
                <p className="p-4">No category available</p>
              )
            ) : (
              <div>
                {category.map((cat) => (
                  <div key={cat.CategoryID} className="flex">
                    <div className="grid grid-cols-1 w-[70%]">
                      <div className="border border-black text-center py-2">
                        {cat.CategoryName}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="ml-2 text-red-600 hover:underline"
                        onClick={() => handleDelete(cat.CategoryID)}
                      >
                        Delete
                      </button>
                      <button
                        className="ml-2 text-blue-600 hover:underline"
                        onClick={() => handleEdit(cat.CategoryID)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Model (rendered outside the blurred container) */}
      {isModel && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CreateCategory setIsModel={setIsModel} />
        </div>
      )}

      {/* Edit Model (rendered outside the blurred container) */}
      {edit && categoryId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditCategory setEdit={setEdit} id={categoryId} />
        </div>
      )}
    </div>
  );
};

export default Categories;
