"use client";
import React, { useState, useEffect } from "react";
import { NavBar } from "./commoms/NavBar";

const Feedback = () => {
  const [feedback, setfeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      const data = await response.json();

      if (response.ok) {
        setfeedback(data);
      } else {
        console.log(data.error || "An error occurred while fetching feedback.");
      }
    } catch (err) {
      console.log("Failed to fetch feedback");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await fetch("/api/customer");
      const data = await response.json();

      if (response.ok) {
        setCustomers(data);
      } else {
        console.log(data.error || "An error occurred while fetching customer.");
      }
    } catch (err) {
      console.log("Failed to fetch customer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeedback();
    fetchCustomer();
  }, []);

  const getCustomerName = (customerID) => {
    const customer = customers.find((c) => c.CustomerID === customerID);
    return customer ? customer.CustomerName : "Unknown";
  };

  return (
    <div>
      <div className="flex">
        <div className="w-[16%]">
          <NavBar />
        </div>
        <div className="w-full m-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="w-full flex justify-between">
            <h1 className="text-[30px] font-semibold">Feedback</h1>
          </div>

          {/* feedback Table */}
          <div className="w-full">
            {feedback.length === 0 ? (
              loading ? (
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <p className="p-4">No feedback available</p>
              )
            ) : (
              <div className="p-4 grid grid-cols-1 gap-5 pb-10">
                {feedback.map((fed) => (
                  <div
                    key={fed.FeedbackID}
                    className="p-3 relative bg-[#f7e4cd] rounded-md"
                  >
                    <p className="font-semibold">
                      {getCustomerName(fed.CustomerID)}
                    </p>
                    <p className="mt-2">{fed.Feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
