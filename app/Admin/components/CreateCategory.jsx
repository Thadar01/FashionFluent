import React, { useState } from "react";

const CreateCategory = ({ setIsModel }) => {
  const [name, setName] = useState("");

  const handleAddCategory = async () => {
    if (!name) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the supplier");
        return;
      }

      alert("Category added successfully");
      setIsModel(false);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission
        handleAddCategory();
      }}
      className="border-2 border-black p-6 w-[400px] flex flex-col gap-4 rounded-lg bg-white shadow-lg"
    >
      {/* Title */}
      <p className="text-[24px] font-semibold text-center">Add Category</p>

      {/* Category Name Input */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Category Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
          placeholder="Category Name"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
        >
          Add
        </button>
        <button
          onClick={() => setIsModel(false)}
          className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default CreateCategory;
