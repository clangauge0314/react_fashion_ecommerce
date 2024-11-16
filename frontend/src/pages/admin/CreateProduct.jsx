import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";

Modal.setAppElement("#root");

function CreateProduct() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: [],
    category: "MARNI バッグ",
    mercari_uri: "",
    description: "",
    status: "yes",
    gender: "male",
    color: [],
    stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "stock") {
      const stockValue = parseInt(value, 10);
      if (stockValue < 0) return; 
      newValue = stockValue;
    }

    setProduct((prev) => {
      const updatedProduct = { ...prev, [name]: newValue };

      if (name === "stock") {
        if (newValue < 2) {
          updatedProduct.status = "no";
        } else {
          updatedProduct.status = prev.status; 
        }
      }

      return updatedProduct;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setProduct((prev) => ({
      ...prev,
      image: [...prev.image, ...imagesWithPreview],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyFields = Object.entries(product).filter(
      ([key, value]) => value === "" || value.length === 0
    );

    if (emptyFields.length > 0) {
      const result = await Swal.fire({
        title: "空欄があります",
        text: "空欄があるまま保存しますか？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "はい",
        cancelButtonText: "いいえ",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("mercari_uri", product.mercari_uri);
      formData.append("description", product.description);
      formData.append("status", product.status);
      formData.append("gender", product.gender);
      formData.append("color", JSON.stringify(product.color));
      formData.append("stock", product.stock);

      product.image.forEach((imgObj) => {
        formData.append("image", imgObj.file);
      });

      const token = localStorage.getItem("token");
      await axios.post("http://183.107.128.217:3000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("成功", "商品が追加されました", "success");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("商品を追加できませんでした:", error);
      Swal.fire("エラー", "商品を追加できませんでした", "error");
    }
  };

  const openModal = (img, index) => {
    setCurrentImage(img.preview);
    setCurrentIndex(index + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
    setCurrentIndex(null);
  };

  const handleColorToggle = (selectedColor) => {
    setProduct((prev) => {
      const colors = prev.color.includes(selectedColor)
        ? prev.color.filter((color) => color !== selectedColor)
        : [...prev.color, selectedColor];
      return { ...prev, color: colors };
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl p-8 bg-white shadow-md rounded-lg space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          新しい商品を追加
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg">基本情報</h3>
              <label className="block mt-2">
                <span className="text-gray-700">商品名</span>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="block mt-4">
                <span className="text-gray-700">商品説明</span>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>

              <label className="block mt-4">
                <span className="text-gray-700">メルカリ URI</span>
                <input
                  type="text"
                  name="mercari_uri"
                  value={product.mercari_uri}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500`}
                />
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-lg">商品メディア</h3>
              <div className="mt-2 border border-dashed border-gray-300 p-4 rounded-md flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="text-indigo-600 cursor-pointer"
                >
                  画像を追加
                </label>
                <div className="mt-4 flex space-x-2">
                  {product.image.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.preview}
                        alt={`Product-${index + 1}`}
                        className="w-16 h-16 rounded-md object-cover cursor-pointer"
                        onClick={() => openModal(img, index)}
                      />
                      <span className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-lg mt-6">色の選択</h3>
              <span className="mt-4 block text-gray-600">
                選択された色:{" "}
                {product.color.length > 0 ? product.color.join(", ") : "なし"}
              </span>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[
                  { color: "red", bg: "bg-red-500" },
                  { color: "orange", bg: "bg-orange-500" },
                  { color: "yellow", bg: "bg-yellow-500" },
                  { color: "green", bg: "bg-green-500" },
                  { color: "blue", bg: "bg-blue-500" },
                  { color: "navy", bg: "bg-[#001f3f]" },
                  { color: "pink", bg: "bg-pink-500" },
                  { color: "purple", bg: "bg-purple-500" },
                  { color: "white", bg: "bg-white" },
                  { color: "black", bg: "bg-black" },
                ].map(({ color, bg }) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`w-8 h-8 rounded-full ${bg} border-2 ${
                      product.color.includes(color)
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    aria-label={color}
                  ></button>
                ))}
              </div>
              <h3 className="font-semibold text-lg mt-10">性別の選択</h3>
              <div className="flex gap-4 mt-2">
                {["male", "female", "unisex"].map((gender) => (
                  <label
                    key={gender}
                    className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 ${
                      product.gender === gender
                        ? "border-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={product.gender === gender}
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="hidden"
                    />
                    <span className="capitalize">
                      {gender === "male"
                        ? "男性"
                        : gender === "female"
                        ? "女性"
                        : "男女共用"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg">価格</h3>
              <label className="block mt-2">
                <span className="text-gray-700">基本価格</span>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-lg">カテゴリー</h3>
              <label className="block mt-2">
                <span className="text-gray-700">商品カテゴリー</span>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="MARNI バッグ">MARNI バッグ</option>
                  <option value="AMI PARIS バッグ">AMI PARIS バッグ</option>
                  <option value="MARC JACOBS バッグ">MARC JACOBS バッグ</option>
                  <option value="Y-3 バッグ">Y-3 バッグ</option>
                  <option value="A.P.C. バッグ">A.P.C. バッグ</option>
                  <option value="Alexander Wang バッグ">
                    Alexander Wang バッグ
                  </option>
                  <option value="その他 ブランドバッグ">
                    その他 ブランドバッグ
                  </option>
                  <option value="アパレル">アパレル</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex gap-8 items-center mt-4">
            <div>
              <span className="text-gray-700">在庫数</span>
              <div className="flex items-center mt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: "stock", value: product.stock - 1 },
                    })
                  }
                  className="px-3 py-2 bg-gray-300 text-gray-800 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-16 text-center border-gray-300 rounded-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: "stock", value: product.stock + 1 },
                    })
                  }
                  className="px-3 py-2 bg-gray-300 text-gray-800 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <span className="text-gray-700">即購入可</span>
              <div className="flex gap-4 mt-2">
                {[
                  { label: "はい", value: "yes", disabled: product.stock <= 1 },
                  {
                    label: "いいえ",
                    value: "no",
                    disabled: product.stock <= 1,
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 ${
                      product.status === option.value
                        ? "border-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={product.status === option.value}
                      disabled={option.disabled} // 재고 수에 따라 비활성화
                      onChange={(e) =>
                        setProduct((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="hidden"
                    />
                    <span
                      className={`${
                        option.disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            商品を追加
          </button>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        className="modal-content flex items-center justify-center p-4 bg-white rounded-lg shadow-lg max-w-lg mx-auto"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="relative p-4 bg-white rounded-lg">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
          {currentImage && (
            <>
              <img
                src={currentImage}
                alt={`Product-${currentIndex}`}
                className="w-full h-auto mb-4"
              />
              <p className="text-center text-lg font-semibold">
                Image {currentIndex}
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default CreateProduct;
