"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateDelivery from "./CreateDelivery";
const Delivery = () => {
  const [isModel, setIsModel] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await fetch("/api/delivery"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setDelivery(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching delivery.");
        }
      } catch (err) {
        setError("Failed to fetch delivery data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [isModel]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = async (deliveryID) => {
    if (!deliveryID) return; // Ensure ID exists before making a request
    try {
      const response = await fetch(`/api/delivery/${deliveryID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete delivery");
      }

      setDelivery((prevdelivery) =>
        prevdelivery.filter((s) => s.DeliveryID !== deliveryID)
      ); // Remove deleted staff from list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="flex">
      <NavBar />
      <div>
        <div>
          <div>Delivery</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreateDelivery setIsModel={setIsModel} />
          </div>
        )}
        <div>
          {delivery.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {delivery.map((deli) => (
                <div
                  key={deli.DeliveryID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>region:{deli.DeliveryRegion}</p>
                  <p>city:{deli.DeliveryCity}</p>
                  <p>cost:{deli.DeliveryCost}</p>
                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(deli.DeliveryID)}
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

export default Delivery;
