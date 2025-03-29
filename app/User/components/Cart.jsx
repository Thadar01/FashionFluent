"use client";
import Image from "next/image";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="p-5">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className=" w-[60%] mb-2">
              <Link href={"/User/Products"} className=" mb-4 flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 27 27"
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
                Continue Shopping
              </Link>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border p-3 mb-3 w-[60%]">
                <Image
                  src={item.image}
                  width={100}
                  height={20}
                  alt={item.title}
                />
                <div className="flex justify-between w-[100%] items-center">
                  <div>
                    <h2 className="text-xl">
                      {item.title}-{item.selectedColor}-{item.selectedSize}
                    </h2>
                    <p>{item.price} MMK</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border-2 border-gray-400 py-1">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className=" px-2 rounded"
                    >
                      -
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className=" px-2 rounded"
                    >
                      +
                    </button>
                  </div>

                  <p>{item.price * item.quantity} MMK</p>

                  <svg
                    onClick={() => removeFromCart(item.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            ))}

            {/* Total Price Section */}
            <div className="mt-5 p-4 border w-[60%] text-xl flex justify-between ">
              <span>Total Price:{totalPrice} MMK</span>
              <Link href={"/User/Checkout"}>Check Out</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
