import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://183.107.128.217:3000/api/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "エラーが発生しました");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.stock <= 0) {
      setQuantity(0);
    }
  }, [product?.stock]);

  useEffect(() => {
    if (product) {
      setCalculatedPrice(quantity * product.price);
    }
  }, [quantity, product]);

  if (loading) {
    return <div>商品を読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-28 max-w-screen-2xl container mx-auto xl:px-28 px-4">
      <div className="flex items-center gap-2 pt-8 text-Black/50">
        <a href="/">Home</a>{" "}
        <a href={`/product/${id}`} className="font-semibold text-black">
          / {product.category}
        </a>
      </div>

      <div className="p-3 max-w-7xl m-auto">
        <div className="mt-6 sm:mt-10">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-[500px] h-[500px] border border-gray-300 rounded-md flex items-center justify-center bg-white">
                  <img
                    src={`http://183.107.128.217:3000/${product.image?.[selectedImageIndex]}`}
                    alt="Product Image"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {product.image?.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-[80px] h-[80px] border rounded-md flex items-center justify-center ${
                        index === selectedImageIndex
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={`http://183.107.128.217:3000/${img}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                  <div className="mt-3 text-yellow-600 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <span className="block text-gray-600">
                      在庫:{" "}
                      <span className="font-semibold">
                        {product.stock > 0 ? product.stock : "在庫切れ"}
                      </span>
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xl text-gray-700">
                      <span className="ml-2 font-bold text-red-500">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-6">
                  {product.stock > 1 ? (
                    <a
                      href="https://jp.mercari.com/user/profile/897136387?utm_source=android&utm_medium=share"
                      className="w-full ml-4 py-3 px-6 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition flex justify-center items-center"
                    >
                      メルカリに移動
                    </a>
                  ) : (
                    <button
                      className={`w-full ml-4 py-3 px-6 font-bold rounded-md transition ${
                        product.stock > 0
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      onClick={() => a()}
                    >
                      この商品を取り寄せ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-xl font-medium text-gray-900">商品説明</h1>

        <div className="mt-4 space-y-6">
          <p
            className="text-sm text-gray-600"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
