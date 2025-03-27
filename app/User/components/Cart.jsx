"use client";
import Image from "next/image";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="p-5">
        <h1 className="text-3xl mb-4">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border p-3 mb-3">
                <Image
                  src={item.image}
                  width={200}
                  height={50}
                  alt={item.title}
                />
                <div>
                  <h2 className="text-xl">{item.title}</h2>
                  <p>{item.price} MMK</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Color: {item.selectedColor}</p>
                  <p>Size: {item.selectedSize}</p>
                  <button
                    className="bg-red-500 text-white px-3 py-1 mt-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
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

export default Cart;
