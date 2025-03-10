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
      <div className={`flex ${showReport ? "filter blur-sm" : ""}`}>
        <NavBar />
        <div className="p-6 w-full">
          <h1 className="text-2xl font-bold mb-4">Purchase Product</h1>
          <div className="space-y-4">
            <div className="flex w-full gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                {loading ? (
                  <p>Loading suppliers...</p>
                ) : (
                  <select
                    value={selectedSupplier}
                    onChange={handleSupplierChange}
                    disabled={isSupplierLocked}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Title
                </label>
                {loading || selectedSupplier === "" ? (
                  <p>Loading products...</p>
                ) : (
                  <select
                    value={selectedProduct}
                    onChange={handleProductChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max="100"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <p className="mt-1">{originalPrice} MMK</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Price
                </label>
                <p className="mt-1">{totalPrice} MMK</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 text-white px-9 h-[35px] rounded-xl hover:bg-blue-600"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Product Title</th>
                  <th className="py-2 px-4 border-b">Supplier</th>
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
                    <td className="py-2 px-4 border-b">{product.supplier}</td>
                    <td className="py-2 px-4 border-b">{product.quantity}</td>
                    <td className="py-2 px-4 border-b">{product.price}</td>
                    <td className="py-2 px-4 border-b">{product.totalPrice}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEditProduct(index)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setShowReport(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
      {showReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Purchase Report</h2>
            <table className="min-w-full bg-white border border-gray-300">
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

            <p className="text-lg">Total Amount: {totalAmount} MMK</p>
            <p className="text-lg">Total Quantity: {totalQuantity}</p>
            <p className="text-lg">
              Supplier:{" "}
              {supplier.find((s) => s.SupplierID === selectedSupplier)
                ?.SupplierName || "N/A"}
            </p>
            <button
              onClick={handlePurchase}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={handleCloseReport}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseForm;
