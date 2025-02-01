import * as React from "react";

function CategoryFilter({ categories }) {
  return (
    <div className="flex flex-wrap gap-8 items-start whitespace-nowrap">
      {categories.map((category, index) => (
        <button
          key={index}
          className="overflow-hidden px-11 py-4 bg-stone-200 rounded-[100px] max-md:px-5 text-2xl"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;