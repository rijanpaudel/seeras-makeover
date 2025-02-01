import * as React from "react";
import ProductCard from "./ProductCard.jsx";
import CategoryFilter from "./CategoryFilter";

function ProductsPage() {
  const categories = ["Skincare", "Haircare", "Kerabon", "Brilliare", "Lotus"];
  
  const products = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/78bedce0bb2c23d9930bb82e3a83c5710ffc6c2b0c3af876f0320d4a5a8acfed?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792",
      wishlistIcon: "https://cdn.builder.io/api/v1/image/assets/TEMP/367098c046b7a69fa10e5a24c776e7e979a5b37643613e30d30bbcb7a493fe06?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792",
      title: "Brilliare Skin Brightening Mosturizer - 150ml",
      price: "1200"
    }
    // Additional products would be added here in the same format
  ];

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
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/949ec9bf238f8b26842958af30e08e7ac6eebdb4fd56983d4c6380667ea990a9?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
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

      <footer className="flex flex-col items-center mt-16 w-full max-md:mt-10 max-md:max-w-full">
        <div className="mt-24 w-full max-w-[1721px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/41e8ebd661321a4351ec945d707d4f3c514c00ad76ff61c48b7c4486bbc9be62?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792"
                alt="Company logo"
                className="object-contain grow mt-32 w-full aspect-[1.34] max-md:mt-10 max-md:max-w-full"
              />
            </div>
            <nav className="flex flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-center self-stretch my-auto font-medium text-center max-md:mt-10">
                <h2 className="text-4xl text-pink-500">Quick Links</h2>
                <ul className="mt-9 space-y-5">
                  <li><a href="/services" className="text-2xl text-black">Services</a></li>
                  <li><a href="/appointment" className="text-2xl text-black">Book Appointment</a></li>
                  <li><a href="/about" className="text-2xl text-black">About us</a></li>
                  <li><a href="/products" className="text-2xl text-black">Products</a></li>
                  <li><a href="/enroll" className="text-2xl text-black">Enroll now</a></li>
                </ul>
              </div>
            </nav>
            <div className="flex flex-col ml-5 w-[49%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-center w-full text-2xl font-medium text-black max-md:mt-10 max-md:max-w-full">
                <nav aria-label="Pagination" className="flex flex-wrap gap-5 justify-between self-stretch whitespace-nowrap max-md:max-w-full">
                  <button className="overflow-hidden px-8 py-3 bg-stone-200 max-md:px-5">Prev</button>
                  <button className="overflow-hidden px-8 py-3 bg-stone-200 max-md:px-5">1</button>
                  <button className="overflow-hidden px-8 py-3 bg-stone-200 max-md:px-5">2</button>
                  <button className="overflow-hidden px-8 py-3 bg-stone-200 max-md:px-5">3</button>
                  <button className="overflow-hidden px-8 py-3 bg-stone-200 max-md:px-5">4</button>
                  <button className="overflow-hidden px-7 py-3 bg-stone-200 max-md:px-5">Next</button>
                </nav>
                <h2 className="mt-9 ml-4 text-4xl text-center text-pink-500">Connect With Us</h2>
                <a href="tel:+9779805238286" className="mt-8 text-center">+977 9805238286</a>
                <div className="flex gap-4 mt-4">
                  <a href="#" aria-label="Facebook">
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/46896395a2997ca29e909d384da273dab34913f431ecda5f85c62e7b90ac9426?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792" alt="" className="object-contain aspect-[0.37] w-[52px]" />
                  </a>
                  <a href="#" aria-label="Instagram">
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb03af537c20e167cd7aa6cd349b8b78921f776009adccfbac7f070dd8423df7?placeholderIfAbsent=true&apiKey=cfca82077f5c43a2b0ca74d2f8c59792" alt="" className="object-contain aspect-[0.43] w-[63px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden self-stretch px-16 py-3.5 mt-2.5 w-full text-xl font-medium text-center text-black bg-pink-100 max-md:px-5 max-md:max-w-full">
          Copyright ©2024 Seeras Makeover Unisex Parlour And Saloon All rights reserved
        </div>
      </footer>
    </div>
  );
}

export default ProductsPage;