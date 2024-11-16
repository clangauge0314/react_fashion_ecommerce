import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://183.107.128.217:3000/api/products"
        );
        const data = response.data;
        setProducts(data);

        if (category === "all") {
          setFilteredItems(data);
        } else {
          setFilteredItems(data.filter((item) => item.category === category));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [category]);

  useEffect(() => {
    if (sortOption === "default") {
      const initialFilteredItems =
        category === "all"
          ? products
          : products.filter((item) => item.category === category);
      setFilteredItems(initialFilteredItems);
      handleResetFilters();
    } else {
      let sortedItems = [...filteredItems];
      if (sortOption === "priceHigh") {
        sortedItems.sort((a, b) => b.price - a.price);
      } else if (sortOption === "priceLow") {
        sortedItems.sort((a, b) => a.price - b.price);
      }
      setFilteredItems(sortedItems);
    }
  }, [sortOption]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredItems.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    navigate(`/category/${selectedCategory}`);
  };

  const handleSearch = () => {
    const filtered = products.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchPrice =
        (!minPrice || Number(item.price) >= Number(minPrice)) &&
        (!maxPrice || Number(item.price) <= Number(maxPrice));
      const matchStatus = !selectedStatus || item.status === selectedStatus;
      const matchGender = !selectedGender || item.gender === selectedGender;
      const matchColor =
        selectedColors.length === 0 ||
        selectedColors.some((color) => item.color.includes(color));

      return (
        matchCategory &&
        matchSearch &&
        matchPrice &&
        matchStatus &&
        matchGender &&
        matchColor
      );
    });

    setFilteredItems(filtered);
    setCurrentPage(0);
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    if (name === "minPrice") setMinPrice(Number(value) || "");
    if (name === "maxPrice") setMaxPrice(Number(value) || "");
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSelectedStatus("");
    setSelectedGender("");
    setItemsPerPage(16);
    setCurrentPage(0);
    setSortOption("default");

    if (category === "all") {
      setFilteredItems(products);
    } else {
      setFilteredItems(products.filter((item) => item.category === category));
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex pt-20 space-x-6 px-4 md:px-10 lg:px-20 xl:px-80 overflow-auto">
      <div
        className="hidden md:block w-1/4 space-y-4 sticky top-20"
        style={{ minWidth: "280px" }}
      >
        <h2 className="text-xl font-semibold mb-2">絞込み検索</h2>

        <div>
          <label className="block font-semibold mb-2">カテゴリー:</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          >
            <option value="all">全ての商品</option>
            <option value="MARNI バッグ">MARNI バッグ</option>
            <option value="AMI PARIS バッグ">AMI PARIS バッグ</option>
            <option value="MARC JACOBS バッグ">MARC JACOBS バッグ</option>
            <option value="Y-3 バッグ">Y-3 バッグ</option>
            <option value="A.P.C. バッグ">A.P.C. バッグ</option>
            <option value="Alexander Wang バッグ">Alexander Wang バッグ</option>
            <option value="その他 ブランドバッグ">その他 ブランドバッグ</option>
            <option value="アパレル">アパレル</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">商品名検索:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded"
            placeholder="商品名で検索"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">価格範囲:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              value={minPrice}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border rounded"
              placeholder="最低価格"
            />
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              onChange={handlePriceChange}
              className="w-1/2 p-2 border rounded"
              placeholder="最高価格"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            カラー:{" "}
            <span className="ml-2 text-gray-600">
              {selectedColors.length > 0 ? selectedColors.join(", ") : "未選択"}
            </span>
          </label>

          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => handleColorChange("red")}
              className={`w-8 h-8 rounded-full bg-red-500 border-2 ${
                selectedColors.includes("red")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="赤"
            ></button>

            <button
              onClick={() => handleColorChange("orange")}
              className={`w-8 h-8 rounded-full bg-orange-500 border-2 ${
                selectedColors.includes("orange")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="橙"
            ></button>

            <button
              onClick={() => handleColorChange("yellow")}
              className={`w-8 h-8 rounded-full bg-yellow-500 border-2 ${
                selectedColors.includes("yellow")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="黄"
            ></button>

            <button
              onClick={() => handleColorChange("green")}
              className={`w-8 h-8 rounded-full bg-green-500 border-2 ${
                selectedColors.includes("green")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="緑"
            ></button>

            <button
              onClick={() => handleColorChange("blue")}
              className={`w-8 h-8 rounded-full bg-blue-500 border-2 ${
                selectedColors.includes("blue")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="青"
            ></button>

            <button
              onClick={() => handleColorChange("navy")}
              className={`w-8 h-8 rounded-full bg-blue-900 border-2 ${
                selectedColors.includes("navy")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="紺"
            ></button>

            <button
              onClick={() => handleColorChange("pink")}
              className={`w-8 h-8 rounded-full bg-pink-500 border-2 ${
                selectedColors.includes("pink")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="ピンク"
            ></button>

            <button
              onClick={() => handleColorChange("purple")}
              className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${
                selectedColors.includes("purple")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="紫"
            ></button>

            <button
              onClick={() => handleColorChange("white")}
              className={`w-8 h-8 rounded-full bg-white border-2 ${
                selectedColors.includes("white")
                  ? "border-black"
                  : "border-gray-300"
              }`}
              aria-label="白"
            ></button>

            <button
              onClick={() => handleColorChange("black")}
              className={`w-8 h-8 rounded-full bg-black border-2 ${
                selectedColors.includes("black")
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="黒"
            ></button>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">即購入可:</label>
          <select
            onChange={handleStatusChange}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            <option value="yes">はい</option>
            <option value="no">いいえ</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">性別:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleGenderChange}
                className="mr-2"
              />
              男性
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleGenderChange}
                className="mr-2"
              />
              女性
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="unisex"
                onChange={handleGenderChange}
                className="mr-2"
              />
              男女共用
            </label>
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="w-full bg-gray-300 text-black py-2 rounded mb-2"
        >
          リセット
        </button>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          検索する
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 md:w-1/2 p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">絞込み検索</h2>

            <div className="mb-4">
              <label className="block font-semibold mb-2">カテゴリー:</label>
              <select
                value={category}
                onChange={(e) => {
                  handleCategoryChange(e);
                  toggleModal();
                }}
                className="w-full p-2 border rounded"
              >
                <option value="all">全ての商品</option>
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
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">商品名検索:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded"
                placeholder="商品名で検索"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">価格範囲:</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={minPrice}
                  onChange={handlePriceChange}
                  className="w-1/2 p-2 border rounded"
                  placeholder="最低価格"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={maxPrice}
                  onChange={handlePriceChange}
                  className="w-1/2 p-2 border rounded"
                  placeholder="最高価格"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                カラー:{" "}
                <span className="ml-2 text-gray-600">
                  {selectedColors.length > 0
                    ? selectedColors.join(", ")
                    : "未選択"}
                </span>
              </label>
              <div className="grid grid-cols-5 gap-2 sm:flex sm:space-x-3">
                <button
                  onClick={() => handleColorChange("red")}
                  className={`w-8 h-8 rounded-full bg-red-500 border-2 ${
                    selectedColors.includes("red")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="赤"
                ></button>

                <button
                  onClick={() => handleColorChange("orange")}
                  className={`w-8 h-8 rounded-full bg-orange-500 border-2 ${
                    selectedColors.includes("orange")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="橙"
                ></button>

                <button
                  onClick={() => handleColorChange("yellow")}
                  className={`w-8 h-8 rounded-full bg-yellow-500 border-2 ${
                    selectedColors.includes("yellow")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="黄"
                ></button>

                <button
                  onClick={() => handleColorChange("green")}
                  className={`w-8 h-8 rounded-full bg-green-500 border-2 ${
                    selectedColors.includes("green")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="緑"
                ></button>

                <button
                  onClick={() => handleColorChange("blue")}
                  className={`w-8 h-8 rounded-full bg-blue-500 border-2 ${
                    selectedColors.includes("blue")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="青"
                ></button>

                <button
                  onClick={() => handleColorChange("navy")}
                  className={`w-8 h-8 rounded-full bg-blue-900 border-2 ${
                    selectedColors.includes("navy")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="紺"
                ></button>

                <button
                  onClick={() => handleColorChange("pink")}
                  className={`w-8 h-8 rounded-full bg-pink-500 border-2 ${
                    selectedColors.includes("pink")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="ピンク"
                ></button>

                <button
                  onClick={() => handleColorChange("purple")}
                  className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${
                    selectedColors.includes("purple")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="紫"
                ></button>

                <button
                  onClick={() => handleColorChange("white")}
                  className={`w-8 h-8 rounded-full bg-white border-2 ${
                    selectedColors.includes("white")
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  aria-label="白"
                ></button>

                <button
                  onClick={() => handleColorChange("black")}
                  className={`w-8 h-8 rounded-full bg-black border-2 ${
                    selectedColors.includes("black")
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="黒"
                ></button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">即購入可:</label>
              <select
                onChange={handleStatusChange}
                className="w-full p-2 border rounded"
              >
                <option value="">選択してください</option>
                <option value="yes">はい</option>
                <option value="no">いいえ</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">性別:</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={handleGenderChange}
                    className="mr-2"
                  />
                  男性
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={handleGenderChange}
                    className="mr-2"
                  />
                  女性
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="unisex"
                    onChange={handleGenderChange}
                    className="mr-2"
                  />
                  男女共用
                </label>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full bg-gray-300 text-black py-2 rounded mb-4"
            >
              リセット
            </button>

            <button
              onClick={handleSearch}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              検索する
            </button>

            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow">
        <div className="flex items-center gap-2 text-Black/50 mb-4">
          <a href="/" className="hover:underline">
            ホーム
          </a>
          <span>/</span>
          <a
            href={`/category/${category}`}
            className="font-semibold text-black hover:underline"
          >
            {category === "all" ? "全ての商品" : category}
          </a>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {category === "all" ? "全ての商品" : category}
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-semibold mr-2">全商品数:</span>
            <span>{filteredItems.length} 個</span>
          </div>
          <div className="flex items-center">
            <label className="mr-2">表示する商品数:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border rounded"
            >
              <option value="4">4</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex justify-end items-center">
          <div className="flex items-center space-x-4 mr-4 md:mr-0">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border rounded"
            >
              <option value="default">基本</option>
              <option value="recommended">おすすめ順</option>
              <option value="new">新しい順</option>
              <option value="priceHigh">価格の高い順</option>
              <option value="priceLow">価格の低い順</option>
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleModal}
              className="md:hidden bg-blue-500 text-white px-2 py-1 rounded"
            >
              絞込み検索
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              検索された商品がありません。
            </p>
          ) : (
            currentItems.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={`http://183.107.128.217:3000/${product.image?.[0]}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      {product.name.length > 20
                        ? `${product.name.slice(0, 20)}...`
                        : product.name}
                    </h2>
                    <p className="text-xl font-semibold text-red-500 mt-2">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <ReactPaginate
          previousLabel={"← 前へ"}
          nextLabel={"次へ →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center mt-6 space-x-2"}
          pageClassName={"px-3 py-1 border rounded"}
          activeClassName={"bg-blue-500 text-white"}
          previousClassName={"px-3 py-1 border rounded"}
          nextClassName={"px-3 py-1 border rounded"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>
  );
};

export default CategoryProducts;
