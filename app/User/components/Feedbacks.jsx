"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Feedbacks = () => {
  const [isModal, setIsModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFeedbackID, setEditingFeedbackID] = useState(null);
  const { data: session } = useSession();

  let userID = "";
  if (session) {
    userID = session.user.id;
  }

  if (!session) {
    redirect("/User/SignIn");
  }

  const handlePost = async () => {
    try {
      const method = editingFeedbackID ? "PUT" : "POST";
      const url = editingFeedbackID
        ? `/api/feedback/${editingFeedbackID}`
        : "/api/feedback";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, userID }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while posting feedback");
        return;
      }

      alert(editingFeedbackID ? "Feedback updated." : "Feedback posted.");
      setFeedback("");
      setEditingFeedbackID(null);
      setIsModal(false);
      fetchFeedback();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  const handleDelete = async (feedbackID) => {
    try {
      const res = await fetch(`/api/feedback/${feedbackID}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete feedback.");
        return;
      }

      alert("Feedback deleted successfully.");
      fetchFeedback();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  const handleEdit = (feedbackData) => {
    setIsModal(true);
    setFeedback(feedbackData.Feedback);
    setEditingFeedbackID(feedbackData.FeedbackID);
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data);
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
  }, [isModal]);

  const getCustomerName = (customerID) => {
    const customer = customers.find((c) => c.CustomerID === customerID);
    return customer ? customer.CustomerName : "Unknown";
  };

  return (
    <div>
      <div className={`${isModal ? "filter blur-sm" : ""}`}>
        <NavBar />
        <div className=" px-7 py-3 min-h-screen">
          <button
            onClick={() => {
              setIsModal(true);
              setFeedback("");
              setEditingFeedbackID(null);
            }}
            className="bg-[#FFD2A2] py-1 px-8 rounded-xl hover:bg-[#eeb87f] justify-self-end flex mr-5"
          >
            Write
          </button>
          {feedbacks.length === 0 ? (
            loading ? (
              <div className="flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="p-4">No feedback available</p>
            )
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              {feedbacks.map((fed) => (
                <div
                  key={fed.FeedbackID}
                  className="relative bg-white rounded-2xl shadow-md p-5 border border-gray-100 transition hover:shadow-xl"
                >
                  <div className="mb-3">
                    <p className="text-lg font-semibold text-gray-800">
                      {getCustomerName(fed.CustomerID)}
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {fed.Feedback}
                  </p>

                  {fed.CustomerID === userID && (
                    <div className="absolute top-4 right-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(fed)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 28 28"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(fed.FeedbackID)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="sm:w-[90%] lg:w-[30%] md:w-[50%] bg-white p-6 rounded-lg shadow-lg relative flex flex-col gap-3">
            <p className="text-lg font-semibold">
              {editingFeedbackID
                ? "Edit your feedback"
                : "Your feedback & suggestions"}
            </p>
            <div className="flex flex-col w-full gap-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
                required
                placeholder="Feedback and suggestion"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f9cb99] p-2 rounded-md hover:bg-[#f9bd7c]"
            >
              {editingFeedbackID ? "Update" : "Post"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModal(false);
                setEditingFeedbackID(null);
                setFeedback("");
              }}
            >
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
