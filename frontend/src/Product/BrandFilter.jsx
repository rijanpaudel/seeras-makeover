import React from "react";

function BrandFilter({ brands, selectedBrand, setSelectedBrand }) {
  return (
    <div className="flex flex-wrap gap-8 items-start whitespace-nowrap">
      {brands.map((brand, index) => (
        <button
          key={index}
          onClick={() => setSelectedBrand(brand)}
          className={`overflow-hidden px-11 py-4 rounded-[100px] text-2xl ${
            selectedBrand === brand
              ? "bg-pink-500 text-white"
              : "bg-stone-200 text-black"
          }`}
        >
          {brand}
        </button>
      ))}
      {selectedBrand && (
        <button
          onClick={() => setSelectedBrand("")}
          className="overflow-hidden px-11 py-4 rounded-[100px] text-2xl bg-gray-300 text-black"
        >
          All Brands
        </button>
      )}
    </div>
  );
}

export default BrandFilter;
