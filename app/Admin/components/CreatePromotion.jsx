import React, { useState, useEffect } from "react";

const CreatePromotion = ({ setIsModel }) => {
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

  const handleAddPromotion = async () => {
    const { percent, title, staffID } = promotion;
    if (!percent || !title || !staffID) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotion), // Send the entire promotion object
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the promotion");
        return;
      }

      alert("Promotion added successfully");
      setIsModel(false);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <div className="border-2 border-black p-6 w-[400px] flex flex-col gap-4 rounded-lg bg-white shadow-lg">
      {/* Title */}
      <h2 className="text-[24px] font-semibold text-center">
        Create Promotion
      </h2>

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
                {s.StaffName} {/* Make sure to use the correct property name */}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleAddPromotion}
          className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
        >
          Add
        </button>
        <button
          onClick={() => setIsModel(false)}
          className="bg-gray-300 px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreatePromotion;
