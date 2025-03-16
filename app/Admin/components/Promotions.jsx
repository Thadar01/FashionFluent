"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import CreatePromotion from "./CreatePromotion";
import EditPromotion from "./EditPromotion";

const Promotions = () => {
  const [isModel, setIsModel] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [id, setID] = useState(null);

  const fetchPromotions = async () => {
    try {
      const [promotionsRes, staffRes] = await Promise.all([
        fetch("/api/promotion"),
        fetch("/api/staff"),
      ]);

      const promotionsData = await promotionsRes.json();
      const staffData = await staffRes.json();

      if (promotionsRes.ok && staffRes.ok) {
        // Create a map of StaffID to StaffName
        const staffMap = staffData.reduce((acc, staff) => {
          acc[staff.StaffID] = staff.StaffName;
          return acc;
        }, {});

        // Replace StaffID with StaffName
        const updatedPromotions = promotionsData.map((promo) => ({
          ...promo,
          StaffName: staffMap[promo.StaffID] || "Unknown",
        }));

        setPromotions(updatedPromotions);
        setFilteredPromotions(updatedPromotions);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      setError("Failed to fetch promotion or staff data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPromotions();
    const interval = setInterval(fetchPromotions, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isModel]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredPromotions(promotions);
      } else {
        setFilteredPromotions(
          promotions.filter(
            (promo) =>
              promo.PromotionTitle.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              promo.PromotionPercent.toString().includes(searchQuery) ||
              promo.StaffID.toString().includes(searchQuery)
          )
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, promotions]);

  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (promotionID) => {
    if (!promotionID) return;
    try {
      const response = await fetch(`/api/promotion/${promotionID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete promotion");
      }

      setPromotions((prev) =>
        prev.filter((promo) => promo.PromotionID !== promotionID)
      );
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  const handleEdit = (id) => {
    setEdit(true);
    setID(id);
  };
  return (
    <div>
      {/* Background Content (will be blurred when model or edit is open) */}
      <div className={`flex ${isModel || edit ? "filter blur-sm" : ""}`}>
        <NavBar />
        <div className="w-full m-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-[30px] font-semibold">Promotions</h2>
            <button
              className="bg-[#f5cba9] h-10 w-[100px] p-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
              onClick={() => setIsModel(!isModel)}
            >
              Add
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-[20%] my-3">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 w-full rounded-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-3 top-5 transform -translate-y-1/2 size-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          {/* Promotions Table */}
          <div className="w-full mt-4">
            <div className="grid grid-cols-7 w-[70%]">
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                ID
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Title
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Percent
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Description
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Start Date
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                End Date
              </div>
              <div className="font-semibold border border-black py-2 bg-[#ceb8a1] text-center">
                Staff ID
              </div>
            </div>
            {filteredPromotions.length === 0 ? (
              loading ? (
                <p className="p-4">loading...</p>
              ) : (
                <p className="p-4">No promotion available</p>
              )
            ) : (
              <div>
                {filteredPromotions.map((promo) => (
                  <div key={promo.PromotionID} className="flex">
                    <div className="grid grid-cols-7 w-[70%]">
                      <div className="border border-black text-center py-2">
                        {promo.PromotionID}
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.PromotionTitle}
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.PromotionPercent}%
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.PromoDes}
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.StartDate}
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.EndDate}
                      </div>
                      <div className="border border-black text-center py-2">
                        {promo.StaffName}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="ml-2 text-red-600 hover:underline"
                        onClick={() => handleDelete(promo.PromotionID)}
                      >
                        Delete
                      </button>
                      <button
                        className="ml-2 text-blue-600 hover:underline"
                        onClick={() => handleEdit(promo.PromotionID)}
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

      {/* Create Promotion Modal (rendered outside the blurred container) */}
      {isModel && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <CreatePromotion setIsModel={setIsModel} />
        </div>
      )}

      {/* Edit Promotion Modal (rendered outside the blurred container) */}
      {edit && id && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditPromotion id={id} setEdit={setEdit} />
        </div>
      )}
    </div>
  );
};

export default Promotions;
