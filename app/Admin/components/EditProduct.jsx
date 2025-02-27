import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const EditProduct = () => {
  const param = useSearchParams();
  const id = param.get("id");
  const [product, setProduct] = useState({
    title: "",
    price: "",
    gender: "",
    colors: "",
    stocks: "",
    image: null,
    categoryID: "",
    promotionID: "",
  });

  const [category, setCategory] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true); // New loading state for product
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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProduct({
            title: data.ProductTitle,
            price: data.ProductPrice,
            gender: data.Gender,
            colors: data.ProductColors,
            stocks: data.Stock,
            image: data.Image,
            categoryID: data.CategoryID,
            promotionID: data.PromotionID,
          });
        } else {
          setError(data.error || "Failed to fetch product data");
        }
      } catch (err) {
        setError("Failed to fetch product data");
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleEditProduct = async () => {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("gender", product.gender);
    formData.append("colors", product.colors);
    formData.append("stocks", product.stocks);
    formData.append("categoryID", product.categoryID);
    formData.append("promotionID", product.promotionID);
    formData.append("image", product.image);

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "An error occurred while updating the product");
        return;
      }

      alert("Product updated successfully");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 border-2 border-black p-10">
        <p>Title</p>
        <input
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
        <p>Price</p>
        <input
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <p>Gender</p>
        <div>
          {["Male", "Female", "Unisex"].map((g) => (
            <label key={g}>
              <input
                type="radio"
                name="gender"
                value={g}
                checked={product.gender === g}
                onChange={(e) =>
                  setProduct({ ...product, gender: e.target.value })
                }
              />
              {g}
            </label>
          ))}
        </div>
        <p>Color</p>
        <input
          value={product.colors}
          onChange={(e) => setProduct({ ...product, colors: e.target.value })}
        />
        <p>Stock</p>
        <input
          type="number"
          value={product.stocks}
          onChange={(e) => setProduct({ ...product, stocks: e.target.value })}
          className="border p-1 w-full"
        />
        <p>Image</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div>
          <label>Category</label>
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
        <div>
          <label>Promotion</label>
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
        <button onClick={handleEditProduct}>Edit</button>
      </div>
    </div>
  );
};

export default EditProduct;
