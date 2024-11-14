import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const CategoryProducts = () => {
  const { category } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-bold">Category: {category}</h1>
    </div>
  );
};

export default CategoryProducts;
