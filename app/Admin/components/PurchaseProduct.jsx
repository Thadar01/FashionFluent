"use client";
import React, { useEffect, useState } from "react";
import { NavBar } from "./commoms/NavBar";

const PurchaseProduct = () => {
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

    // Do not reset the selectedSupplier here
    setSelectedProduct("");
    setQuantity(1);
    setProductPrice(0);
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
  };

  const originalPrice = selectedProduct
    ? Math.floor(productPrice - productPrice * 0.05)
    : 0;
  const totalPrice = selectedProduct ? originalPrice * quantity : 0;

  // Calculate the total price for all products
  const totalAmount = addedProducts.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  const totalQuantity = addedProducts.reduce(
    (total, product) => total + Number(product.quantity), // Use Number() to ensure it's treated as a number
    0
  );

  return (
    <div className="flex">
      <NavBar />
      <div>
        <div>Purchase Product</div>
        <div>
          <p>Supplier</p>
          <p>{selectedSupplier}</p>

          {loading ? (
            <p>Loading suppliers...</p>
          ) : (
            <select
              value={selectedSupplier}
              onChange={handleSupplierChange}
              disabled={!!selectedSupplier} // Disable dropdown if supplier is selected
            >
              <option value="">Select Supplier</option>
              {supplier.map((sup) => (
                <option key={sup.SupplierID} value={sup.SupplierID}>
                  {sup.SupplierName}
                </option>
              ))}
            </select>
          )}

          <p>Product Title</p>
          {loading || selectedSupplier === "" ? (
            <p>Loading products...</p>
          ) : (
            <select value={selectedProduct} onChange={handleProductChange}>
              <option value="">Select Product</option>
              {product.map((p) => (
                <option key={p.ProductID} value={p.ProductID}>
                  {p.ProductTitle}
                </option>
              ))}
            </select>
          )}

          <p>Price: {originalPrice} MMK</p>

          <p>Quantity</p>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max="100"
          />

          <p>Total Price: {totalPrice} MMK</p>

          <button onClick={handleAddProduct}>
            {isEditing ? "Update" : "Add"}
          </button>

          <table>
            <thead>
              <tr>
                <th>Product Title</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.productTitle}</td>
                  <td>{product.supplier}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.totalPrice}</td>
                  <td>
                    <button onClick={() => handleEditProduct(index)}>
                      Edit
                    </button>
                    <button onClick={() => handleRemoveProduct(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Total Amount: {totalAmount} MMK</p>
          <p>Total Quantity: {totalQuantity}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseProduct;
