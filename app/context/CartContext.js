// context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add item to cart


  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
      );

      if (existingIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingIndex];

        // Avoid exceeding stock
        const totalQuantity = existingItem.quantity + newItem.quantity;
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: Math.min(totalQuantity, existingItem.stock),
        };

        return updatedItems;
      }

      // If not in cart, add as new item
      return [...prevItems, newItem];
    });
  };


  // Function to remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]); // Resets cart to an empty array
  };


  // Function to get the total count of items in the cart
  const getCartItemCount = () => {
    return cartItems.length;
  };


  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };


  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getCartItemCount,increaseQuantity,decreaseQuantity ,clearCart}}
    >
      {children}
    </CartContext.Provider>
  );
};
