"use client";
import React, { useState, useEffect } from "react";

const EditDelivery = ({ setEdit, id }) => {
  const [delivery, setDelivery] = useState({
    region: "",
    city: "",
    cost: "",
  });

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
    <div className="border-2 border-black p-4">
      <div>Edit Delivery</div>

      <p>Region</p>
      <input
        value={delivery.region}
        onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
      />

      <p>City</p>
      <input
        value={delivery.city}
        onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
      />

      <p>Cost</p>
      <input
        value={delivery.cost}
        onChange={(e) => setDelivery({ ...delivery, cost: e.target.value })}
      />

      <div className="mt-4">
        <button className="mr-10" onClick={handleUpdateDelivery}>
          Update
        </button>
        <button onClick={() => setEdit(false)}>Close</button>
      </div>
    </div>
  );
};

export default EditDelivery;
