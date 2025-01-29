import * as React from "react";

function ProductCard({ image, wishlistIcon, title, price }) {
  return (
    <div className="flex flex-col w-full">
      <div className="pt-3.5 pr-3 pb-16 pl-20 bg-gray-200 rounded-3xl max-md:pl-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src={image}
              alt={title}
              className="object-contain grow mt-11 w-full aspect-[0.93] max-md:mt-10 max-md:-mr-4"
            />
          </div>
          <div className="flex flex-col ml-5 w-[19%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src={wishlistIcon}
              alt=""
              className="object-contain shrink-0 w-20 aspect-[0.89] max-md:mt-3.5"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start pr-3.5 pl-1.5 mt-5 w-full text-3xl max-md:max-w-full">
        <div className="font-medium text-black">{title}</div>
        <div className="mt-5 font-bold text-black">Rs {price}</div>
        <div className="flex gap-5 justify-between self-stretch mt-10 max-md:max-w-full">
          <button className="overflow-hidden px-6 py-4 text-pink-500 bg-white border border-pink-500 border-solid rounded-[100px] max-md:px-5">
            Add to cart
          </button>
          <button className="overflow-hidden px-11 py-4 text-white bg-pink-500 rounded-[100px] max-md:px-5">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;