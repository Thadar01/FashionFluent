"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";
import NavBar from "../components/commom/NavBar";
import Footer from "../components/commom/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Checkout = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { data: session } = useSession();
  const [delivery, setDelivery] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    id: session?.user.id || "",
    name: session?.user.name || "",
    email: session?.user.email || "",
    phone: "",
    address: "",
    paymentMethod: "",
    deliveryMethod: "",
  });

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await fetch(`/api/delivery`);
        if (!res.ok) throw new Error("Failed to fetch delivery options");
        const data = await res.json();
        setDelivery(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDelivery();
  }, []);

  // Calculate total cart amount
  const totalCartAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate final total including delivery fee
  const finalTotal = totalCartAmount + deliveryFee;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update delivery fee when selecting a delivery method
    if (name === "deliveryMethod") {
      const selectedDelivery = delivery.find((d) => d.DeliveryID === value);
      setDeliveryFee(selectedDelivery ? selectedDelivery.DeliveryCost : 0);
    }
  };

  const handleOrder = async () => {
    try {
      const orderData = {
        orderDate: new Date().toISOString().split("T")[0],
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: finalTotal,
        deliveryID: formData.deliveryMethod,
        address: formData.address,
        phoneNo: formData.phone,
        email: formData.email,
        id: formData.id,
        orderStatus: false,
        carts: cartItems.map((item) => ({
          ProductID: item.id,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
        })),
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setShowSuccessModal(true); // Show modal
        clearCart();
        setFormData((prev) => ({
          ...prev,
          phone: "",
          address: "",
          deliveryMethod: "",
        }));
        setDeliveryFee(0);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to process order.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <NavBar />
      <Link href={"User/Cart"} className="ml-10 flex ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        Back to Cart
      </Link>
      <div className="flex flex-col md:flex-row gap-6 w-full items-center md:items-start md:justify-around mb-9">
        <div className="lg:w-[60%] w-[85%] p-5 border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          {error && <p className="text-red-500">{error}</p>}

          {/* Cart Summary (Read-Only) */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOrder();
            }}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Delivery Method Dropdown */}
            <div>
              <label className="block font-semibold">
                Delivery City/Region
              </label>
              {loading ? (
                <div className="animate-spin rounded-full border-t-2 border-blue-500 w-8 h-8"></div>
              ) : (
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select City/Region</option>
                  {delivery.map((option) => (
                    <option key={option.DeliveryID} value={option.DeliveryID}>
                      {option.DeliveryRegion} - {option.DeliveryCost} MMK
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-semibold">Payment Method</label>
              <p>Cash on Delivery</p>
            </div>

            {/* Order Total */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#e3a775] p-2 rounded font-semibold hover:bg-[#c98b58] "
            >
              Place Order
            </button>
          </form>
        </div>
        <div className="flex flex-col lg:w-[30%] w-[85%]">
          <div className="border-2 p-4 rounded mb-5 bg-white border-[#e3a775] ">
            <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-3 mb-3"
                >
                  <Image
                    src={item.image}
                    width={60}
                    height={60}
                    alt={item.title}
                  />
                  <div className="flex justify-between w-full">
                    <div>
                      <h2 className="text-lg">
                        {item.title} - {item.selectedColor} -{" "}
                        {item.selectedSize}
                      </h2>
                      <p>{item.price} MMK</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {item.price * item.quantity} MMK
                    </p>
                  </div>
                </div>
              ))
            )}
            <h3 className="font-semibold">Subtotal: {totalCartAmount} MMK</h3>
            <h3 className="font-semibold">Delivery Fee: {deliveryFee} MMK</h3>
            <h3 className="font-semibold text-lg">Total: {finalTotal} MMK</h3>
          </div>
        </div>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Order Successful!</h2>
              <p className="mb-6">
                Thank you for your order. We’ll process it shortly.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/User/OrderHistory");
                }}
                className="bg-[#e3a775] hover:bg-[#c98b58] text-white py-2 px-4 rounded"
              >
                Track Your Order
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
