"use client";
import React, { useState, useEffect } from "react";

const EditDelivery = ({ setEdit, id }) => {
  const [delivery, setDelivery] = useState({
    region: "",
    city: "",
    cost: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing delivery data based on the id prop
    const fetchDeliveryData = async () => {
      try {
        const res = await fetch(`/api/delivery/${id}`);
        const data = await res.json();

        if (res.ok) {
          setDelivery({
            region: data.DeliveryRegion,
            city: data.DeliveryCity,
            cost: data.DeliveryCost,
          });
        } else {
          alert(data.error || "Failed to fetch delivery data");
        }
      } catch (err) {
        console.error("Error fetching delivery data:", err);
        alert("Failed to fetch delivery data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeliveryData();
    }
  }, [id]);

  const handleUpdateDelivery = async () => {
    if (!delivery.region || !delivery.city || !delivery.cost) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(`/api/delivery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(delivery),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while updating the delivery");
        return;
      }

      alert("Delivery updated successfully");

      // Close the modal after saving
      setEdit(false);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="border-2 border-black p-6 bg-white rounded-lg shadow-lg w-[400px]">
      <h2 className="text-[24px] font-semibold mb-4">Edit Delivery</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
            />
          </div>

          {/* City Input */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              value={delivery.city}
              onChange={(e) =>
                setDelivery({ ...delivery, city: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>

          {/* Cost Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input
              value={delivery.cost}
              onChange={(e) =>
                setDelivery({ ...delivery, cost: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
              onClick={() => handleUpdateDelivery()}
            >
              Edit
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
              onClick={() => setEdit(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDelivery;
