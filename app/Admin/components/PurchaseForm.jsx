"use client";
import React, { useEffect, useState } from "react";
import { NavBar } from "./commoms/NavBar";
import { useSession } from "next-auth/react";
const PurchaseForm = () => {
  const { data: session, status } = useSession();

  const [supplier, setSupplier] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedProducts, setAddedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [isSupplierLocked, setIsSupplierLocked] = useState(false);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch("/api/supplier");
        const data = await response.json();
        if (response.ok) {
          setSupplier(data);
        } else {
          alert(data.error || "An error occurred while fetching suppliers.");
        }
      } catch (err) {
        console.error("Failed to fetch supplier data", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          alert(data.error || "An error occurred while fetching products.");
        }
      } catch (err) {
        console.error("Failed to fetch product data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
    fetchProduct();
  }, []);

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
    setSelectedProduct("");
    setProductPrice(0);
    setQuantity(1);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    const selectedProductDetails = product.find(
      (p) => p.ProductID === e.target.value
    );
    setProductPrice(selectedProductDetails?.ProductPrice || 0);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleAddProduct = () => {
    if (!selectedProduct || !selectedSupplier || quantity <= 0) {
      alert("Please select a product and quantity.");
      return;
    }

    const selectedProductDetails = product.find(
      (p) => p.ProductID === selectedProduct
    );

    const newProduct = {
      ProductID: selectedProduct, // Include ProductID
      productTitle: selectedProductDetails?.ProductTitle,
      supplier: supplier.find((s) => s.SupplierID === selectedSupplier)
        ?.SupplierName,
      quantity,
      price: Math.floor(productPrice - productPrice * 0.05),
      totalPrice: Math.floor(productPrice - productPrice * 0.05) * quantity,
    };

    if (isEditing) {
      const updatedProducts = [...addedProducts];
      updatedProducts[editIndex] = newProduct;
      setAddedProducts(updatedProducts);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setAddedProducts((prev) => [...prev, newProduct]);
    }

    setSelectedProduct("");
    setQuantity(1);
    setProductPrice(0);
    setIsSupplierLocked(true);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = addedProducts.filter((_, i) => i !== index);
    setAddedProducts(updatedProducts);
  };

  const handleEditProduct = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    const productToEdit = addedProducts[index];

    const supplierID = supplier.find(
      (s) => s.SupplierName === productToEdit.supplier
    )?.SupplierID;
    const productID = product.find(
      (p) => p.ProductTitle === productToEdit.productTitle
    )?.ProductID;

    setSelectedSupplier(supplierID || "");
    setSelectedProduct(productID || "");
    setQuantity(productToEdit.quantity);
    setProductPrice(productToEdit.price);
    setIsSupplierLocked(false);
  };

  const originalPrice = selectedProduct
    ? Math.floor(productPrice - productPrice * 0.05)
    : 0;
  const totalPrice = selectedProduct ? originalPrice * quantity : 0;

  const totalAmount = addedProducts.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  const totalQuantity = addedProducts.reduce(
    (total, product) => total + Number(product.quantity),
    0
  );

  const handlePurchase = async () => {
    const purchaseData = {
      SupplierID: selectedSupplier,
      StaffID: session.user.id, // Replace with actual StaffID (e.g., from user session)
      Date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      totalQuantity,
      totalPrice: totalAmount,
      products: addedProducts.map((product) => ({
        ProductID: product.ProductID, // Ensure ProductID is included
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.totalPrice,
      })),
    };

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        alert("Purchase successful!");
        setSelectedSupplier(""); // Allow selecting a new supplier
        setSelectedProduct("");
        setQuantity(1);
        setProductPrice(0);
        setAddedProducts([]); // Clear product list
        setIsEditing(false);
        setEditIndex(null);
        setShowReport(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to process purchase.");
      }
    } catch (err) {
      console.error("Failed to process purchase", err);
      alert("An error occurred while processing the purchase.");
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };
  useEffect(() => {
    if (addedProducts.length === 0) {
      setIsSupplierLocked(false); // Enable dropdown if no products in list
    }
  }, [addedProducts]);

  return (
    <div>
      <div className={`flex`}>
        <div className="w-[16%]">
          <NavBar />
        </div>
        <div className="p-6 w-full items-center flex flex-col gap-10">
          <h1 className="text-2xl font-bold mb-4">Purchase Product Form</h1>
          <div className="flex justify-around w-[90%]">
            <form
              className="bg-white p-6 rounded-xl shadow-lg h-[350px]"
              onSubmit={(e) => {
                e.preventDefault(); // Prevents default form submission
                handleAddProduct();
              }}
            >
              {/* Supplier & Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  {loading ? (
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <select
                      value={selectedSupplier}
                      onChange={handleSupplierChange}
                      disabled={isSupplierLocked}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {supplier.map((sup) => (
                        <option key={sup.SupplierID} value={sup.SupplierID}>
                          {sup.SupplierName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title
                  </label>
                  {loading || selectedSupplier === "" ? (
                    <p className="text-gray-500">Choose Supplier</p>
                  ) : (
                    <select
                      value={selectedProduct}
                      onChange={handleProductChange}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Product</option>
                      {product.map((p) => (
                        <option key={p.ProductID} value={p.ProductID}>
                          {p.ProductTitle}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Price Details */}
              <div className="flex justify-between items-center mt-5 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <p className="text-lg font-semibold">{originalPrice} MMK</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Price
                  </label>
                  <p className="text-lg font-semibold text-[#af7f57]">
                    {totalPrice} MMK
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full mt-5 bg-[#e3a775]  font-semibold py-2 rounded-lg hover:bg-[#af7f57] transition duration-200"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </form>

            <div>
              {isSupplierLocked && (
                <>
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-xl font-bold mb-4">Purchase Lists</h2>
                      <p className="font-semibold mb-3">
                        Supplier -{" "}
                        {supplier.find((s) => s.SupplierID === selectedSupplier)
                          ?.SupplierName || "N/A"}
                      </p>
                      <table className="min-w-full bg-white border border-gray-300 mb-4">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b">
                              Product Title
                            </th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Total Price</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedProducts.map((product, index) => (
                            <tr key={index}>
                              <td className="py-2 px-4 border-b">
                                {product.productTitle}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {product.quantity}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {product.price} MMK
                              </td>
                              <td className="py-2 px-4 border-b">
                                {product.totalPrice} MMK
                              </td>
                              <td className="py-2 px-4 border-b flex ">
                                <svg
                                  onClick={() => handleEditProduct(index)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="text-blue-500 hover:text-blue-700 mr-2 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                                <svg
                                  onClick={() => handleRemoveProduct(index)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={() => setShowReport(true)}
                        className="bg-[#e3a775] px-4 py-2 rounded-md hover:bg-[#af7f57] "
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Purchase Report</h2>

            <svg
              onClick={handleCloseReport}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 absolute top-3 right-5 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            <table className="min-w-full bg-white border border-gray-300 mb-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Product Title</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {addedProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {product.productTitle}
                    </td>
                    <td className="py-2 px-4 border-b">{product.quantity}</td>
                    <td className="py-2 px-4 border-b">{product.price}</td>
                    <td className="py-2 px-4 border-b">{product.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>Total Amount: {totalAmount} MMK</p>
            <p>Total Quantity: {totalQuantity}</p>
            <p>
              Supplier:{" "}
              {supplier.find((s) => s.SupplierID === selectedSupplier)
                ?.SupplierName || "N/A"}
            </p>
            <button
              onClick={handlePurchase}
              className="mt-4 bg-[#e3a775] w-full  px-4 py-2 rounded-md hover:bg-[#b48055] "
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
