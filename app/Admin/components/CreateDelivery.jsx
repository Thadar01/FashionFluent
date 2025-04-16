"use client";
import React, { useState } from "react";

const CreateDelivery = ({ setIsModel }) => {
  const [delivery, setDelivery] = useState({
    region: "",
    cost: "",
  });
  const handleAddDelivery = async () => {
    const { region, cost } = delivery;

    if (!region || !cost) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, cost }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the delivery");
        return;
      }

      alert("Delivery added successfully");
      setIsModel(false);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form
      className="border-2 border-black p-6 bg-white rounded-lg shadow-lg w-[400px]"
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission
        handleAddDelivery();
      }}
    >
      <h2 className="text-[24px] font-semibold mb-4">Create Delivery</h2>
      <div className="flex flex-col gap-4">
        {/* Region Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <input
            value={delivery.region}
            onChange={(e) =>
              setDelivery({ ...delivery, region: e.target.value })
            }
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Delivery Region"
          />
        </div>

        {/* Cost Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Cost</label>
          <input
            value={delivery.cost}
            onChange={(e) => setDelivery({ ...delivery, cost: e.target.value })}
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            required
            placeholder="Delivery Cost"
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
            className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
            onClick={() => setIsModel(false)}
          >
            Close
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateDelivery;
