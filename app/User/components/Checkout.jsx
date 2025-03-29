"use client";

import { use, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useSession } from "next-auth/react";

const Checkout = () => {
  const { cartItems } = useCart();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user.name,
    email: session?.user.email,
    phone: "",
    address: "",
    paymentMethod: "credit_card",
  });

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-lg mx-auto p-5 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block font-semibold">Shipping Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block font-semibold">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="p-3 border rounded bg-gray-100">
          <h3 className="font-semibold">Total Price: {totalAmount} MMK</h3>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
