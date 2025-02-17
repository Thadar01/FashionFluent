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
    <div className="border-2 border-black text-black w-[300px] p-4">
      <h2 className="text-lg font-bold mb-2">Create Promotion</h2>

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
                {s.StaffName} {/* Make sure to use the correct property name */}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleAddPromotion}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
        <button
          onClick={() => setIsModel(false)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Close
        </button>

        <p>{promotion.staffID}</p>
      </div>
    </div>
  );
};

export default CreatePromotion;
