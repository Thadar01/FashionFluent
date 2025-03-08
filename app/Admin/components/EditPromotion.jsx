import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const EditPromotion = ({ setEdit, id }) => {
  const { data: session, status } = useSession();

  const [promotion, setPromotion] = useState({
    percent: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    staffID: session?.user?.id || "", // Auto-assign the current user if available
  });

  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff/adminStaff");
        const data = await response.json();

        if (response.ok) {
          setStaff(data); // Store the staff data in state
        } else {
          setError(data.error || "An error occurred while fetching staff.");
        }
      } catch (err) {
        setError("Failed to fetch staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const fetchPromotionData = async () => {
      try {
        const response = await fetch(`/api/promotion/${id}`);
        const data = await response.json();

        if (response.ok) {
          setPromotion({
            percent: data.PromotionPercent,
            title: data.PromotionTitle,
            description: data.PromoDes,
            startDate: data.StartDate,
            endDate: data.EndDate,
            staffID: data.StaffID,
          });
        } else {
          setError(data.error || "Failed to fetch promotion data");
        }
      } catch (err) {
        setError("Failed to fetch promotion data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPromotionData();
    }
  }, [id]);

  const handleUpdatePromotion = async () => {
    const { percent, title, description, startDate, endDate, staffID } =
      promotion;
    if (
      !percent ||
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !staffID
    ) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch(`/api/promotion/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotion),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Promotion updated successfully");
        setEdit(false); // Close the edit form after successful update
      } else {
        alert(data.error || "An error occurred while updating the promotion");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="border-2 border-black p-6 w-[400px] flex flex-col gap-4 rounded-lg bg-white shadow-lg">
      <h2 className="text-[24px] font-semibold text-center">Edit Promotion</h2>

      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          {/* Promotion Title */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Promotion Title</label>
            <input
              value={promotion.title}
              onChange={(e) =>
                setPromotion({ ...promotion, title: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>

          {/* Promotion Description */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={promotion.description}
              onChange={(e) =>
                setPromotion({ ...promotion, description: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>

          {/* Promotion Percent */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Promotion Percent</label>
            <input
              type="number"
              value={promotion.percent}
              onChange={(e) =>
                setPromotion({ ...promotion, percent: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>

          {/* Start and End Date */}
          <div className="flex">
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={promotion.startDate}
                onChange={(e) =>
                  setPromotion({ ...promotion, startDate: e.target.value })
                }
                className="w-[90%] p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={promotion.endDate}
                onChange={(e) =>
                  setPromotion({ ...promotion, endDate: e.target.value })
                }
                className="w-[90%] p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleUpdatePromotion}
              className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
            >
              Edit
            </button>
            <button
              onClick={() => setEdit(false)}
              className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditPromotion;
