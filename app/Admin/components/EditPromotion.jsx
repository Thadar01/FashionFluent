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
    <div className="border-2 border-black text-black w-[300px] p-4">
      <h2 className="text-lg font-bold mb-2">Edit Promotion</h2>

      <div>
        <label className="block mb-1">Promotion Percent</label>
        <input
          type="number"
          value={promotion.percent}
          onChange={(e) =>
            setPromotion({ ...promotion, percent: e.target.value })
          }
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="block mt-2">Promotion Title</label>
        <textarea
          value={promotion.title}
          onChange={(e) =>
            setPromotion({ ...promotion, title: e.target.value })
          }
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="block mt-2">Assign to Staff</label>
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
            className="border p-1 w-full"
          >
            <option value="">Select Staff</option>
            {staff.map((s) => (
              <option key={s.StaffID} value={s.StaffID} className="text-black">
                {s.StaffName}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEdit(false)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditPromotion;
