import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import CategoryFilter from "./CategoryFilter";
import axios from "axios";
import BrandFilter from "./BrandFilter.jsx";

function ProductsPage() {
  const categories = ["Skincare", "Haircare", "Nailcare"];
  const brands = ["Brillare", "Kerabon", "Lotus", "Dermaco"]
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]); //Store products
  const [loading, setLoading] = useState(true); //Loading state
  const [error, setError] = useState(null); //Error state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

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
        setFilteredProducts(updatedProducts);
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

  //Filter products based on search term whenever searchTerm or products change
  useEffect(() => {
    let updatedList = [...products];

    //Filter by searchTerm (title)
    if (searchTerm) {
      updatedList = updatedList.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      updatedList = updatedList.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedBrand) {
      updatedList = updatedList.filter(
        (product) => product.brand === selectedBrand
      );
    }


    //Sort by price if sortOrder is set
    if (sortOrder === "asc") {
      updatedList.sort((a, b) => a.price - b.price);
    }
    else if (sortOrder === "desc") {
      updatedList.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedList);
  }, [searchTerm, products, sortOrder, selectedCategory, selectedBrand]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-gray-600">Loading...</p>
      </div>
    );
  }

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
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <BrandFilter
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
          <div className="flex items-center gap-4">
            {/* Sort dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-gray-800"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 justify-between items-start mt-9 w-full max-w-[1773px] max-md:max-w-full">
          <h1 className="self-end mt-6 text-4xl font-bold">All Products</h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex overflow-hidden flex-wrap gap-10 self-start px-9 py-3.5 text-2xl bg-zinc-100 rounded-[100px] max-md:px-5 max-md:max-w-full">
            <label htmlFor="searchProducts" className="sr-only">Search Products</label>
            <input
              id="searchProducts"
              type="search"
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 p-20">
        {filteredProducts.map(product => (
          <div key={product._id}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;