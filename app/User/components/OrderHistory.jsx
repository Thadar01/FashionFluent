"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const OrderHistory = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!session) {
      router.push("/User/SignIn");
    } else {
      const fetchOrders = async () => {
        try {
          const res = await fetch(
            `/api/orderhistory?customerID=${session.user.id}`
          );
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setLoading(false); // Stop loading once data is fetched
        }
      };
      fetchOrders();
    }
  }, [session]);

  const toggleOrderDetails = (orderID) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderID]: !prev[orderID],
    }));
  };

  return (
    <div className="min-h-screen ">
      <NavBar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Order History
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full border-t-2 border-blue-500 w-8 h-8"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {orders.map((order) => (
              <div
                key={order.OrderID}
                className="bg-white rounded-lg shadow-md p-5 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">
                        Order ID:
                      </span>{" "}
                      {order.OrderID}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Date:</span>{" "}
                      {order.OrderDate}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        Total Quantity:
                      </span>{" "}
                      {order.TotalQuantity}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        Total Price:
                      </span>{" "}
                      {order.TotalPrice} MMK
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">
                        Status:
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          order.OrderStatus === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.OrderStatus === 0 ? "Pending..." : "Confirmed"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleOrderDetails(order.OrderID)}
                    className="text-gray-500 hover:text-black transition"
                  >
                    {expandedOrders[order.OrderID] ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Expandable Order Details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedOrders[order.OrderID] ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  {expandedOrders[order.OrderID] &&
                    order.OrderDetails.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <p className="font-semibold text-gray-800 mb-3">
                          Products:
                        </p>
                        <ul className="space-y-3">
                          {order.OrderDetails.map((detail) => (
                            <li
                              key={detail.OrderDetailID}
                              className="flex items-center gap-4"
                            >
                              <img
                                src={detail.ImageURL}
                                alt={detail.ProductName}
                                className="w-16 h-16 object-cover rounded-md shadow-sm"
                              />
                              <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-medium text-gray-900">
                                  {detail.ProductName}
                                </p>
                                <p>Quantity: {detail.UnitQuantity}</p>
                                <p>Unit Price: {detail.UnitPrice} MMK</p>
                                <p className="text-gray-800 font-medium">
                                  Subtotal: {detail.SubTotal} MMK
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
