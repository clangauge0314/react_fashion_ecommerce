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
    category: "Electronics",
    mercari_uri: "",
    description: "",
    details: "",
    highlights: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setProduct((prev) => ({
      ...prev,
      image: [...prev.image, ...filePreviews],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/products", product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("成功", "商品が追加されました", "success");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("商品を追加できませんでした:", error);
      Swal.fire("エラー", "商品を追加できませんでした", "error");
    }
  };

  const openModal = (img, index) => {
    setCurrentImage(img);
    setCurrentIndex(index + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
    setCurrentIndex(null);
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
                        src={img}
                        alt={`Product-${index + 1}`}
                        className="w-16 h-16 rounded-md object-cover cursor-pointer"
                        onClick={() => openModal(img, index)} // 이미지 클릭 시 모달 열기
                      />
                      <span className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                        {index + 1} {/* 순서 표시 */}
                      </span>
                    </div>
                  ))}
                </div>
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
                  required
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
                  required
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

          <div>
            <h3 className="font-semibold text-lg">追加情報</h3>
            <label className="block mt-2">
              <span className="text-gray-700">詳細</span>
              <textarea
                name="details"
                value={product.details}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">ハイライト</span>
              <textarea
                name="highlights"
                value={product.highlights}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">ステータス</span>
              <input
                type="text"
                name="status"
                value={product.status}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-lg shadow-md text-lg focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </label>
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
