import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

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
  const [selectedColor, setSelectedColor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/products.json", {
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json();
        setProducts(data);
        if (category === "all") {
          setFilteredItems(data);
        } else {
          setFilteredItems(data.filter((item) => item.category === category));
        }
      } catch (error) {
        console.log("Error fetching data", error);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    if (name === "minPrice") setMinPrice(value);
    if (name === "maxPrice") setMaxPrice(value);
  };

  const handleSearch = () => {
    const filtered = products.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchPrice =
        (!minPrice || item.price >= minPrice) &&
        (!maxPrice || item.price <= maxPrice);
      return matchCategory && matchSearch && matchPrice;
    });
    setFilteredItems(filtered);
    setCurrentPage(0);
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setItemsPerPage(16);
    setCurrentPage(0);
    if (category === "all") {
      setFilteredItems(products);
    } else {
      setFilteredItems(products.filter((item) => item.category === category));
    }
    setIsModalOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="flex pt-20 space-x-6 px-4 md:px-10 lg:px-20 xl:px-80 overflow-auto">
      <div className="hidden md:block w-1/4 space-y-4 sticky top-20">
        <h2 className="text-xl font-semibold mb-2">絞込み検索</h2>

        <div>
          <label className="block font-semibold mb-2">カテゴリー:</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          >
            <option value="all">全ての商品</option>
            <option value="category_1">Category 1</option>
            <option value="category_2">Category 2</option>
            <option value="category_3">Category 3</option>
            <option value="category_4">Category 4</option>
            <option value="category_5">Category 5</option>
            <option value="category_6">Category 6</option>
            <option value="category_7">Category 7</option>
            <option value="category_8">Category 8</option>
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
          <label className="block font-semibold mb-2">カラー:</label>
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => setSelectedColor("red")}
              className={`w-8 h-8 rounded-full bg-red-500 border-2 ${
                selectedColor === "red" ? "border-black" : "border-transparent"
              }`}
              aria-label="赤"
            ></button>

            <button
              onClick={() => setSelectedColor("orange")}
              className={`w-8 h-8 rounded-full bg-orange-500 border-2 ${
                selectedColor === "orange"
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="橙"
            ></button>

            <button
              onClick={() => setSelectedColor("yellow")}
              className={`w-8 h-8 rounded-full bg-yellow-500 border-2 ${
                selectedColor === "yellow"
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="黄"
            ></button>

            <button
              onClick={() => setSelectedColor("green")}
              className={`w-8 h-8 rounded-full bg-green-500 border-2 ${
                selectedColor === "green"
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="緑"
            ></button>

            <button
              onClick={() => setSelectedColor("blue")}
              className={`w-8 h-8 rounded-full bg-blue-500 border-2 ${
                selectedColor === "blue" ? "border-black" : "border-transparent"
              }`}
              aria-label="青"
            ></button>

            <button
              onClick={() => setSelectedColor("navy")}
              className={`w-8 h-8 rounded-full bg-blue-900 border-2 ${
                selectedColor === "navy" ? "border-black" : "border-transparent"
              }`}
              aria-label="紺"
            ></button>

            <button
              onClick={() => setSelectedColor("pink")}
              className={`w-8 h-8 rounded-full bg-pink-500 border-2 ${
                selectedColor === "pink" ? "border-black" : "border-transparent"
              }`}
              aria-label="ピンク"
            ></button>

            <button
              onClick={() => setSelectedColor("purple")}
              className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${
                selectedColor === "purple"
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="紫"
            ></button>

            <button
              onClick={() => setSelectedColor("white")}
              className={`w-8 h-8 rounded-full bg-white border-2 ${
                selectedColor === "white" ? "border-black" : "border-gray-300"
              }`}
              aria-label="白"
            ></button>

            <button
              onClick={() => setSelectedColor("black")}
              className={`w-8 h-8 rounded-full bg-black border-2 ${
                selectedColor === "black"
                  ? "border-black"
                  : "border-transparent"
              }`}
              aria-label="黒"
            ></button>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">即購入可:</label>
          <select className="w-full p-2 border rounded">
            <option value="">選択してください</option>
            <option value="yes">はい</option>
            <option value="no">いいえ</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">性別:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="radio" name="gender" value="mens" className="mr-2" />
              メンズ
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="ladies"
                className="mr-2"
              />
              レディース
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
                <option value="category_1">Category 1</option>
                <option value="category_2">Category 2</option>
                <option value="category_3">Category 3</option>
                <option value="category_4">Category 4</option>
                <option value="category_5">Category 5</option>
                <option value="category_6">Category 6</option>
                <option value="category_7">Category 7</option>
                <option value="category_8">Category 8</option>
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
              <label className="block font-semibold mb-2">カラー:</label>
              <div className="grid grid-cols-5 gap-2 sm:flex sm:space-x-3">
                <button
                  onClick={() => setSelectedColor("red")}
                  className={`w-8 h-8 rounded-full bg-red-500 border-2 ${
                    selectedColor === "red"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="赤"
                ></button>

                <button
                  onClick={() => setSelectedColor("orange")}
                  className={`w-8 h-8 rounded-full bg-orange-500 border-2 ${
                    selectedColor === "orange"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="橙"
                ></button>

                <button
                  onClick={() => setSelectedColor("yellow")}
                  className={`w-8 h-8 rounded-full bg-yellow-500 border-2 ${
                    selectedColor === "yellow"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="黄"
                ></button>

                <button
                  onClick={() => setSelectedColor("green")}
                  className={`w-8 h-8 rounded-full bg-green-500 border-2 ${
                    selectedColor === "green"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="緑"
                ></button>

                <button
                  onClick={() => setSelectedColor("blue")}
                  className={`w-8 h-8 rounded-full bg-blue-500 border-2 ${
                    selectedColor === "blue"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="青"
                ></button>

                <button
                  onClick={() => setSelectedColor("navy")}
                  className={`w-8 h-8 rounded-full bg-blue-900 border-2 ${
                    selectedColor === "navy"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="紺"
                ></button>

                <button
                  onClick={() => setSelectedColor("pink")}
                  className={`w-8 h-8 rounded-full bg-pink-500 border-2 ${
                    selectedColor === "pink"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="ピンク"
                ></button>

                <button
                  onClick={() => setSelectedColor("purple")}
                  className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${
                    selectedColor === "purple"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="紫"
                ></button>

                <button
                  onClick={() => setSelectedColor("white")}
                  className={`w-8 h-8 rounded-full bg-white border-2 ${
                    selectedColor === "white"
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  aria-label="白"
                ></button>

                <button
                  onClick={() => setSelectedColor("black")}
                  className={`w-8 h-8 rounded-full bg-black border-2 ${
                    selectedColor === "black"
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  aria-label="黒"
                ></button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">即購入可:</label>
              <select className="w-full p-2 border rounded">
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
                    value="mens"
                    className="mr-2"
                  />
                  メンズ
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="ladies"
                    className="mr-2"
                  />
                  レディース
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              検索された商品がありません。
            </p>
          ) : (
            currentItems.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-900 truncate">
                      {product.title}
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
