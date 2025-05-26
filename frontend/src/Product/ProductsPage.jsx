import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import CategoryFilter from "./CategoryFilter";
import axios from "axios";
import BrandFilter from "./BrandFilter.jsx";
import { useAuth } from "../Context/AuthContext.jsx";

function ProductsPage() {
  const categories = ["Skincare", "Haircare", "Nailcare"];
  const brands = ["Brillare", "Kerabon", "Lotus", "Dermaco"]
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]); //Store products
  const [loading, setLoading] = useState(true); //Loading state for initial load
  const [searchLoading, setSearchLoading] = useState(false); //Loading state for search
  const [error, setError] = useState(null); //Error state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearch, setCurrentSearch] = useState(""); // Track the active search term
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { user } = useAuth(); //Get user from context

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

  // Handle search submission with delay
  const handleSearchSubmit = () => {
    setSearchLoading(true); // Start loading effect
    
    // Simulate 3 second loading time before search results appear
    setTimeout(() => {
      setCurrentSearch(searchTerm);
      setSearchLoading(false); // End loading effect
    }, 3000);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  //Filter products based on active search term and other filters
  useEffect(() => {
    let updatedList = [...products];

    // Only apply filtering if there's an active search term
    if (currentSearch) {
      updatedList = updatedList.filter((product) => 
        // Search by title (name)
        product.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
        // Search by brand
        product.brand.toLowerCase().includes(currentSearch.toLowerCase()) ||
        // Search by category
        product.category.toLowerCase().includes(currentSearch.toLowerCase())
      );
    }

    // Apply category filter if selected
    if (selectedCategory) {
      updatedList = updatedList.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply brand filter if selected
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
  }, [currentSearch, products, sortOrder, selectedCategory, selectedBrand]);

  useEffect(() => {
    if (!user?._id) return;
  
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recommendations/${user._id}`);
        setRecommendedProducts(res.data.recommendedProducts);
      } catch (error) {
        console.log("No recommendations yet.");
      }
    };
  
    fetchRecommendations();
  }, [user?._id]);

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
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="flex overflow-hidden flex-wrap gap-10 self-start px-9 py-3.5 text-2xl bg-zinc-100 rounded-[100px] max-md:px-5 max-md:max-w-full">
            <label htmlFor="searchProducts" className="sr-only">Search Products</label>
            <input
              id="searchProducts"
              type="search"
              placeholder="Search by name, brand, or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="my-auto bg-transparent border-none outline-none w-64"
            />
            <button 
              type="submit" 
              aria-label="Search"
              className="flex items-center justify-center"
              disabled={searchLoading}
            >
              {searchLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>

      {searchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 p-20">
          <div className="flex flex-col items-center justify-center col-span-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900 mb-4"></div>
            <p className="text-2xl text-gray-600">Searching products...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 p-20">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product._id}>
                <ProductCard {...product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-2xl text-gray-600">
              No products found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;