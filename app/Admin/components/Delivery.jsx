"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import CreateDelivery from "./CreateDelivery";
import EditDelivery from "./EditDelivery";

const Delivery = () => {
  const [isModel, setIsModel] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [filteredDelivery, setFilteredDelivery] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null); // New state to store the category ID

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await fetch("/api/delivery");
        const data = await response.json();

        if (response.ok) {
          setDelivery(data);
          setFilteredDelivery(data);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredDelivery(delivery);
      } else {
        setFilteredDelivery(
          delivery.filter(
            (deli) =>
              deli.DeliveryRegion.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              deli.DeliveryCity.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              deli.DeliveryCost.toString().includes(searchQuery)
          )
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, delivery]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (deliveryID) => {
    if (!deliveryID) return;
    try {
      const response = await fetch(`/api/delivery/${deliveryID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete delivery");
      }

      setDelivery((prev) => prev.filter((d) => d.DeliveryID !== deliveryID));
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (id) => {
    setDeliveryId(id); // Store the ID of the category to be edited
    setEdit(true); // Show the Edit form
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="w-full m-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[30px] font-semibold">Delivery</h2>
          <button
            className="bg-blue-300 h-10 w-fit p-2 rounded-md"
            onClick={() => setIsModel(!isModel)}
          >
            Add
          </button>
        </div>

        {isModel && (
          <div className="mt-4">
            <CreateDelivery setIsModel={setIsModel} />
          </div>
        )}

        {edit && deliveryId && (
          <div>
            <EditDelivery setEdit={setEdit} id={deliveryId} />
          </div>
        )}

        <input
          type="text"
          placeholder="Search by region, city, or cost..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-400 rounded mt-4 w-[20%]"
        />

        <div className="w-full mt-4">
          {filteredDelivery.length === 0 ? (
            <p className="p-4">No deliveries available</p>
          ) : (
            <div>
              {/* Header Row with Borders */}
              <div className="grid grid-cols-3 w-[70%]">
                <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                  Region
                </div>
                <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                  City
                </div>
                <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                  Cost
                </div>
              </div>

              {filteredDelivery.map((deli) => (
                <div key={deli.DeliveryID} className="flex">
                  <div className="grid grid-cols-3 w-[70%]">
                    <div className="border border-black text-center py-2">
                      {deli.DeliveryRegion}
                    </div>
                    <div className="border border-black text-center py-2">
                      {deli.DeliveryCity}
                    </div>
                    <div className="border border-black text-center py-2">
                      {deli.DeliveryCost}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="ml-2 text-red-600 hover:underline"
                      onClick={() => handleDelete(deli.DeliveryID)}
                    >
                      Delete
                    </button>
                    <button
                      className="ml-2 text-blue-600 hover:underline"
                      onClick={() => handleEdit(deli.DeliveryID)}
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
  );
};

export default Delivery;
