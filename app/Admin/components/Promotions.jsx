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

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("/api/promotion");
        const data = await response.json();

        if (response.ok) {
          setPromotions(data);
          setFilteredPromotions(data);
        } else {
          setError(
            data.error || "An error occurred while fetching promotions."
          );
        }
      } catch (err) {
        setError("Failed to fetch promotion data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
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

  if (loading) return <div>Loading...</div>;
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
    <div className="flex">
      <NavBar />
      <div className="w-full m-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[30px] font-semibold">Promotions</h2>
          <button
            className="bg-blue-300 h-10 w-fit p-2 rounded-md"
            onClick={() => setIsModel(!isModel)}
          >
            Add
          </button>
        </div>

        {isModel && (
          <div className="mt-4">
            <CreatePromotion setIsModel={setIsModel} />
          </div>
        )}

        {edit && id && <EditPromotion id={id} setEdit={setEdit} />}

        <input
          type="text"
          placeholder="Search by title, percent, or staff ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-400 rounded mt-4 w-[20%]"
        />

        <div className="w-full mt-4">
          {filteredPromotions.length === 0 ? (
            <p className="p-4">No promotions available</p>
          ) : (
            <div>
              {/* Header Row with Borders */}
              <div className="grid grid-cols-4 w-[70%]">
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
                  Staff ID
                </div>
              </div>

              {filteredPromotions.map((promo) => (
                <div key={promo.PromotionID} className="flex">
                  <div className="grid grid-cols-4 w-[70%]">
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
                      {promo.StaffID}
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
  );
};

export default Promotions;
