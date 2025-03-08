import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

const CreatePromotion = ({ setIsModel }) => {
  const { data: session, status } = useSession();

  const [promotion, setPromotion] = useState({
    percent: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    staffID: session.user.id, // Auto-assign the current user
  });

  const handleAddPromotion = async () => {
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
      const res = await fetch("/api/promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotion),
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
      <h2 className="text-[24px] font-semibold text-center">
        Create Promotion
      </h2>

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
            className="w-[90%]  p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          />
        </div>
      </div>

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
