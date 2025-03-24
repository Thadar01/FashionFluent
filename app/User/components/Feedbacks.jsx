"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useSession } from "next-auth/react";
import { isNullOrUndefined } from "util";
import { get } from "https";

const Feedbacks = () => {
  const [isModal, setIsModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  let userID = "";
  if (session) {
    userID = session.user.id;
  }

  const handlePost = async () => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, userID }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the supplier");
        return;
      }

      alert("Your feedback is successfully posted.");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback"); // Call the GET route
      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data); // Store the category data in state
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
      const response = await fetch("/api/customer"); // Call the GET route
      const data = await response.json();

      if (response.ok) {
        setCustomers(data); // Store the category data in state
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
    const interval = setInterval(setFeedback, setCustomers, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isModal]);

  const getCustomerName = (customerID) => {
    const customer = customers.find((c) => c.CustomerID === customerID);
    return customer ? customer.CustomerName : "Unknown";
  };

  return (
    <div>
      <div className={` ${isModal ? "filter blur-sm" : ""}`}>
        <NavBar />
        {/* <p>{userID}</p> */}
        <div className="bg-white  px-7 py-3">
          <button
            onClick={() => setIsModal(true)}
            className=" bg-[#FFD2A2] py-1 px-8 rounded-xl hover:bg-[#eeb87f] justify-self-end flex mr-5"
          >
            Write
          </button>
          {feedbacks.length === 0 ? (
            loading ? (
              <p className="p-4">loading...</p>
            ) : (
              <p className="p-4">No feedback available</p>
            )
          ) : (
            <div className="p-4 grid grid-cols-2 gap-16 pb-10">
              {feedbacks.map((fed) => (
                <div
                  key={fed.FeedbackID}
                  className="shadow-lg p-3 relative bg-[#f7e4cd] rounded-md"
                >
                  <p>{getCustomerName(fed.CustomerID)}</p>
                  <p className="mt-2">{fed.Feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
      {isModal && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePost();
          }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
        >
          <div className="sm:w-[90%] lg:w-[30%] md:w-[50%] bg-white p-6 rounded-lg shadow-lg relative flex flex-col gap-3 ">
            <p className="text-lg font-semibold">
              Your feedbacks & suggestions
            </p>
            <div className="flex flex-col w-full gap-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9] "
                required
                placeholder="Feedback and suggestion"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f9cb99] p-2 rounded-md hover:bg-[#f9bd7c] "
            >
              Post
            </button>
            <button onClick={() => setIsModal(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 absolute top-2 right-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Feedbacks;
