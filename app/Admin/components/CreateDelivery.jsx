"use client";
import React, { useState } from "react";

const CreateDelivery = ({ setIsModel }) => {
  const [delivery, setDelivery] = useState({
    region: "",
    city: "",
    cost: "",
  });
  const handleAddDelivery = async () => {
    const { region, city, cost } = delivery;

    if (!region || !city || !cost) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, city, cost }),
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
    <div className="border-2 border-black">
      <div>CreateDelivery</div>
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
      <button className="mr-10" onClick={() => handleAddDelivery()}>
        Add
      </button>
      <button onClick={() => setIsModel(false)}>Close</button>
    </div>
  );
};

export default CreateDelivery;
