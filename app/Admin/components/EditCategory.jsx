import React, { useState, useEffect } from "react";

const EditCategory = ({ setEdit, id }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current category data based on the ID passed as prop
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`/api/category/${id}`);
        const data = await response.json();

        if (response.ok) {
          setName(data.CategoryName); // Populate the input with the category name
        } else {
          setError("Failed to fetch category data");
        }
      } catch (err) {
        setError("Failed to fetch category data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  // Update the category data
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CategoryName: name }), // Send the updated name
      });

      if (response.ok) {
        alert("Update Successful");
        setEdit(false); // Close the edit form after successful update
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update category");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border-2 border-black p-6 w-[400px] flex flex-col gap-4 rounded-lg bg-white shadow-lg">
      {/* Title */}
      <p className="text-[24px] font-semibold text-center">Add Category</p>

      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => handleUpdate()}
              className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
            >
              Edit
            </button>
            <button
              onClick={() => setEdit(false)}
              className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </>
      )}

      {/* Category Name Input */}
    </div>
  );
};

export default EditCategory;
