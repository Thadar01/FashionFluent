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
    <div className="border-2 border-black text-blak w-[200px] h-[100px]">
      <div>CreateCategory</div>
      <div>Category Name</div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => handleAddCategory()} className="mr-10">
        Add
      </button>
      <button onClick={() => setIsModel(false)}>Close</button>
    </div>
  );
};

export default CreateCategory;
