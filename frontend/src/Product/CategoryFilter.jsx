import * as React from "react";

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex flex-wrap gap-8 items-start whitespace-nowrap">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => setSelectedCategory(category)}
          className={`overflow-hidden px-11 py-4 rounded-[100px] text-2xl ${
            selectedCategory === category
              ? "bg-pink-500 text-white"
              : "bg-stone-200 text-black"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;