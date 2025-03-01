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
    <div>
      {/* Background Content (will be blurred when model or edit is open) */}
      <div className={`flex ${isModel || edit ? "filter blur-sm" : ""}`}>
        <NavBar />
        <div className="w-full m-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="w-full flex justify-between">
            <h1 className="text-[30px] font-semibold">Delivery</h1>
            <button
              className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
              onClick={() => setIsModel(!isModel)}
            >
              Add
            </button>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search by region, city, or cost..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 my-3 w-[20%]"
            />
          </div>

          {/* Delivery Table */}
          <div className="w-[50%]">
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
            {filteredDelivery.length === 0 ? (
              loading ? (
                <p className="p-4">loading...</p>
              ) : (
                <p className="p-4">No delivery available</p>
              )
            ) : (
              <div>
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
                        {deli.DeliveryCost} Ks
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

      {/* Create Delivery Modal (rendered outside the blurred container) */}
      {isModel && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CreateDelivery setIsModel={setIsModel} />
        </div>
      )}

      {/* Edit Delivery Modal (rendered outside the blurred container) */}
      {edit && deliveryId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditDelivery setEdit={setEdit} id={deliveryId} />
        </div>
      )}
    </div>
  );
};

export default Delivery;
