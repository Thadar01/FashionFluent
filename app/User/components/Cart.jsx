"use client";
import Image from "next/image";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const { data: session } = useSession();

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const router = useRouter();

  if (!session) {
    redirect("/User/SignIn");
  }

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="p-5">
        {cartItems.length === 0 ? (
          <div className="min-h-[60vh] flex justify-center items-center">
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-xl shadow-inner p-6 text-center w-[70%]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6m12.2-6l1.2 6M6 19a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-700">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Looks like you haven't added anything yet.
              </p>
              <button
                onClick={() => router.push("/User/Products")}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className=" w-[100%] lg:w-[60%] mb-2">
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
              <div
                key={item.id}
                className="flex gap-4 border p-3 mb-3  w-[100%] lg:w-[60%] bg-white rounded-lg shadow-sm"
              >
                <Image
                  src={item.image}
                  width={100}
                  height={20}
                  alt={item.title}
                />
                <div className="flex justify-between w-[100%] items-center">
                  <div>
                    <p>{item.title}</p>
                    <p>Color- {item.selectedColor}</p>
                    <p>Size- {item.selectedSize}</p>
                    <p>Unit Price- {item.price} MMK</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border-2 border-gray-400 py-1 ">
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
            <div className="mt-5 p-4 border-2 border-[#e3a775] lg:w-[60%] w-[100%]  flex justify-between bg-white rounded-lg">
              <p>
                Total Price:
                <span className="font-semibold"> {totalPrice} MMK</span>
              </p>

              <Link
                href={"/User/Checkout"}
                className="bg-[#e3a775] px-2 py-1 rounded-lg hover:bg-[#af7445] "
              >
                Check Out
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
