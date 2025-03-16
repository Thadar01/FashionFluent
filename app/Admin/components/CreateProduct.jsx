import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const CreateProduct = () => {
  const router = useRouter();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    gender: "",
    colors: "",
    sizes: "",
    stocks: "",
    image: null,
    categoryID: "",
    promotionID: "",
  });

  const [category, setCategory] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();

        if (response.ok) {
          setCategory(data);
        } else {
          setError(data.error || "An error occurred while fetching category.");
        }
      } catch (err) {
        setError("Failed to fetch category data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch("/api/promotion");
        const data = await response.json();

        if (response.ok) {
          setPromotion(data);
        } else {
          setError(data.error || "An error occurred while fetching promotion.");
        }
      } catch (err) {
        setError("Failed to fetch promotion data");
        console.error(err);
      } finally {
        setLoading2(false);
      }
    };

    fetchPromotion();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("gender", product.gender);
    formData.append("colors", product.colors);
    formData.append("sizes", product.sizes);
    formData.append("stocks", product.stocks);
    formData.append("categoryID", product.categoryID);
    formData.append("promotionID", product.promotionID);
    formData.append("image", product.image);

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData, // Send as FormData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while adding the product");
        return;
      }

      alert("Product added successfully");
      setProduct({
        title: "",
        description: "",
        price: "",
        gender: "",
        colors: "",
        stocks: "",
        image: null,
        categoryID: "",
        promotionID: "",
      });
      router.push("/Admin/MainDashboard/ManageProducts");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form
      className="p-6 w-[400px] flex flex-col gap-4 "
      onSubmit={(e) => {
        e.preventDefault(); // Prevents default form submission
        handleAddProduct();
      }}
    >
      {/* Title */}
      <h1 className="text-[24px] font-semibold ">Add Product</h1>

      {/* Title Input */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Title</label>
        <input
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>
      {/* Price Input */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Price</label>
        <input
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>

      {/* Gender Radio Buttons */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female", "Unisex"].map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={product.gender === g}
                onChange={(e) =>
                  setProduct({ ...product, gender: e.target.value })
                }
                className="focus:ring-[#f5cba9]"
                required
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Input */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Color</label>
        <input
          value={product.colors}
          onChange={(e) => setProduct({ ...product, colors: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Size</label>
        <input
          value={product.sizes}
          onChange={(e) => setProduct({ ...product, sizes: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>

      {/* Stock Input */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Stock</label>
        <input
          type="number"
          value={product.stocks}
          onChange={(e) => setProduct({ ...product, stocks: e.target.value })}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
          required
        />
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Category</label>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <select
            value={product.categoryID}
            onChange={(e) =>
              setProduct({ ...product, categoryID: e.target.value })
            }
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            required
          >
            <option value="">Select Category</option>
            {category.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>
                {c.CategoryName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Promotion Dropdown */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium">Promotion</label>
        {loading2 ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <select
            value={product.promotionID}
            onChange={(e) =>
              setProduct({ ...product, promotionID: e.target.value })
            }
            className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-[#f5cba9]"
            required
          >
            <option value="">Select Promotion</option>
            {promotion.map((p) => (
              <option key={p.PromotionID} value={p.PromotionID}>
                {p.PromotionTitle}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
        >
          Add
        </button>
        <button
          onClick={() => router.push("/Admin/MainDashboard/ManageProducts")}
          className="bg-[#f5cba9] px-4 py-2 rounded-xl font-semibold border-2 border-black hover:bg-[#f6be90]"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;
