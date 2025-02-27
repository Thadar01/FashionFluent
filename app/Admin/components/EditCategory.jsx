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
        setEdit(false); // Close the edit form after successful update
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update category");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="border-2 border-black text-black w-[300px] p-4">
      <div>Edit Category</div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>Category Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 my-3 w-full"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEdit(false)}
            className="bg-gray-500 text-white p-2"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
};

export default EditCategory;
