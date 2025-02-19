"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";
import CreatePromotion from "./CreatePromotion";

const Promotions = () => {
  const [isModel, setIsModel] = useState(false);
  const [promotion, setPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch("/api/promotion"); // Call the GET route
        const data = await response.json();

        if (response.ok) {
          setPromotion(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching promotion.");
        }
      } catch (err) {
        setError("Failed to fetch promotion data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [isModel]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDelete = async (promotionID) => {
    if (!promotionID) return; // Ensure ID exists before making a request
    try {
      const response = await fetch(`/api/promotion/${promotionID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete promotion");
      }

      setPromotion((prevpromotion) =>
        prevpromotion.filter((s) => s.PromotionID !== promotionID)
      ); // Remove deleted promotion from list
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };
  return (
    <div className="flex">
      <>
        <NavBar />
        {loading && <div></div>}
      </>
      <div className="flex flex-col">
        <div>
          <div>Promotions</div>
          <button onClick={() => setIsModel(!isModel)}>Add</button>
        </div>
        {isModel && (
          <div>
            <CreatePromotion setIsModel={setIsModel} />
          </div>
        )}

        <div>
          {promotion.length === 0 ? (
            <p>No staff available</p>
          ) : (
            <div className="flex flex-wrap gap-10">
              {promotion.map((promo) => (
                <div
                  key={promo.PromotionID}
                  className="border-2 border-black rounded-xl p-2"
                >
                  <p>PromotionID:{promo.PromotionID}</p>
                  <p>Percent:{promo.PromotionPercent}</p>
                  <p>Title:{promo.PromotionTitle}</p>
                  <p>Staff:{promo.StaffID}</p>

                  <button
                    className="bg-red-400 p-2 border-2 border-black"
                    onClick={() => handleDelete(promo.PromotionID)}
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

export default Promotions;
