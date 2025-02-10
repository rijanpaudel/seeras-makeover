import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import CategoryFilter from "./CategoryFilter";
import axios from "axios";

function ProductsPage() {
  const categories = ["Skincare", "Haircare", "Kerabon", "Brilliare", "Lotus"];
  const [products, setProducts] = useState([]); //Store products
  const [loading, setLoading] = useState(true); //Loading state
  const [error, setError] = useState(null); //Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");

        const updatedProducts = response.data.map(product => ({
          ...product,
          image: product.image.startsWith("/uploads")
          ? `http://localhost:5000${product.image}`
          : product.image
        }));
        setProducts(updatedProducts); //Set products in state
      }
      catch (error) {
        setError("Failed to load products.");
      }
      finally {
        setLoading(false); //Stop loading
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <div className="flex flex-col items-center w-full text-black max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4de0f1c7-22a4-4760-8f54-91e1e0cfebea?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
          alt="Products banner"
          className="object-contain self-stretch w-full aspect-[2.76] max-md:max-w-full"
        />
        <div className="flex flex-wrap gap-5 justify-between mt-14 w-full text-2xl max-w-[1769px] max-md:mt-10 max-md:max-w-full">
          <CategoryFilter categories={categories} />
          <button className="flex overflow-hidden gap-2.5 self-start px-8 py-3.5 bg-white border border-black border-solid rounded-[100px] max-md:px-5">
            <span className="grow my-auto">Sort by</span>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ac30c86e27ae0206f629ef6e29cc8303d77ebf59fd737b027005d7ab960f90fe?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
              alt=""
              className="object-contain shrink-0 aspect-[0.68] w-[23px]"
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-5 justify-between items-start mt-9 w-full max-w-[1773px] max-md:max-w-full">
          <h1 className="self-end mt-6 text-4xl font-bold">All Products</h1>
          <form className="flex overflow-hidden flex-wrap gap-10 self-start px-9 py-3.5 text-2xl bg-zinc-100 rounded-[100px] max-md:px-5 max-md:max-w-full">
            <label htmlFor="searchProducts" className="sr-only">Search Products</label>
            <input
              id="searchProducts"
              type="search"
              placeholder="Search Products"
              className="my-auto bg-transparent border-none outline-none"
            />
            <button type="submit" aria-label="Search">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/949ec9bf238f8b26842958af30e08e76eebdb4fd56983d4c6380667ea990a9?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
                alt=""
                className="object-contain shrink-0 w-10 aspect-[1.14]"
              />
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-20">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;