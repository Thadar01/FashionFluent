import React, { useState, useEffect } from "react";

const EditPromotion = ({ setEdit, id }) => {
  const [promotion, setPromotion] = useState({
    percent: "",
    title: "",
    staffID: "",
  });

  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("/api/staff/adminStaff"); // Call the GET route
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

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/promotion/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotion), // Send the updated promotion data
      });

      if (response.ok) {
        setEdit(false); // Close the edit form after successful update
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update promotion");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update promotion");
    }
  };

  return (
    <div className="border-2 border-black p-6 w-[400px] flex flex-col gap-4 rounded-lg bg-white shadow-lg">
      {/* Title */}
      <h2 className="text-[24px] font-semibold text-center">Edit Promotion</h2>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          {" "}
          {/* Promotion Percent Input */}
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
          {/* Promotion Title Input */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Promotion Title</label>
            <textarea
              value={promotion.title}
              onChange={(e) =>
                setPromotion({ ...promotion, title: e.target.value })
              }
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            />
          </div>
          {/* Assign to Staff Dropdown */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-medium">Assign to Staff</label>
            {loading ? (
              <p>Loading staff...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <select
                value={promotion.staffID}
                onChange={(e) =>
                  setPromotion({ ...promotion, staffID: e.target.value })
                }
                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
              >
                <option value="">Select Staff</option>
                {staff.map((s) => (
                  <option key={s.StaffID} value={s.StaffID}>
                    {s.StaffName}{" "}
                    {/* Make sure to use the correct property name */}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleUpdate}
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
