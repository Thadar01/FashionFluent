"use client";
import React, { useEffect, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGender = searchParams.get("gender") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "/api/product";
        if (selectedGender) {
          url += `?gender=${selectedGender}`;
        }

        const [productRes, categoryRes, promoRes] = await Promise.all([
          fetch(url),
          fetch("/api/category"),
          fetch("/api/promotion"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const promoData = await promoRes.json();

        if (productRes.ok && categoryRes.ok && promoRes.ok) {
          setProduct(productData);
          setFilteredProducts(productData);
          setCategories(categoryData);
          setPromotions(promoData);
        } else {
          setError("Error fetching data.");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedGender]);

  return (
    <div>
      <NavBar />

      {/* Gender Filter Buttons */}
      <div className="flex w-full justify-center items-center my-4">
        {filteredProducts.length === 0 ? (
          loading ? (
            <div className="min-h-[60vh] flex justify-center items-center">
              {" "}
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <p className="p-4">No products available</p>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full justify-center m-4 ml-6">
            {filteredProducts.map((p) => (
              <div
                key={p.ProductID}
                className="bg-[#FFFAF4] rounded-xl flex flex-col items-center gap-5 shadow-xl"
              >
                <Link
                  href={{
                    pathname: "/User/ProductDetails",
                    query: { productID: p.ProductID },
                  }}
                  className="w-full h-[300px] bg-red-400 transition-all duration-300 hover:opacity-70"
                >
                  <Image
                    src={p.Image}
                    alt={p.ProductTitle}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </Link>
                <div className="w-full ml-4">
                  <p className="font-bold">{p.ProductTitle}</p>
                  <p>Price: {p.ProductPrice} MMK</p>
                </div>
                <Link
                  href={{
                    pathname: "/User/ProductDetails",
                    query: { productID: p.ProductID },
                  }}
                  className="w-full bg-[#eab174]  p-3 font-bold hover:bg-opacity-60 text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Product;
