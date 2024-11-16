import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTable, useRowSelect } from "react-table";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: "",
    image: [],
    mercari_uri: "",
    description: "",
    status: "",
    color: [],
    stock: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    } else {
      fetchProducts();
    }
  }, [navigate]);

  useEffect(() => {
    setFilteredCount(filteredProducts.length);
  }, [products, selectedCategory, searchKeyword]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://183.107.128.217:3000/api/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        Swal.fire(
          "エラー",
          "セッションが期限切れです。再ログインしてください。",
          "error"
        );
        navigate("/admin");
      }
    }
  };

  const handleMoveImage = (index, direction) => {
    setEditData((prev) => {
      const updatedImages = [...prev.image];
      if (direction === "up" && index > 0) {
        [updatedImages[index - 1], updatedImages[index]] = [
          updatedImages[index],
          updatedImages[index - 1],
        ];
      } else if (direction === "down" && index < updatedImages.length - 1) {
        [updatedImages[index], updatedImages[index + 1]] = [
          updatedImages[index + 1],
          updatedImages[index],
        ];
      }
      return { ...prev, image: updatedImages };
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchKeyword]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "アクション",
        Cell: ({ row }) => (
          <FaEdit
            className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
            onClick={() => handleEditClick(row)}
          />
        ),
      },
      { Header: "商品名", accessor: "name" },
      { Header: "価格", accessor: "price" },
      { Header: "在庫数", accessor: "stock" },
      {
        Header: "画像",
        accessor: "image",
        Cell: ({ value }) =>
          value && value.length > 0 ? (
            <img
              src={`http://183.107.128.217:3000/${value[0]}`}
              alt="Product"
              className="w-16 h-16 rounded-md object-cover cursor-pointer"
              onClick={() =>
                handleImageClick(`http://183.107.128.217:3000/${value[0]}`)
              }
            />
          ) : (
            "なし"
          ),
      },
      { Header: "カテゴリー", accessor: "category" },
      { Header: "メルカリ URI", accessor: "mercari_uri" },
      { Header: "即購入可", accessor: "status" },
      { Header: "性別", accessor: "gender" },
      {
        Header: "色",
        accessor: "color",
        Cell: ({ value }) => (Array.isArray(value) ? value.join(", ") : value),
      },
      {
        Header: "作成日",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable({ columns, data: paginatedProducts }, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }) => (
          <input type="checkbox" {...row.getToggleRowSelectedProps()} />
        ),
      },
      ...columns,
    ]);
  });

  const handleDeleteSelected = async (selectedIds) => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://183.107.128.217:3000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      fetchProducts();
      Swal.fire("成功", "選択した商品が削除されました。", "success");
    } catch (error) {
      console.error("Failed to delete selected products:", error);
      Swal.fire("エラー", "商品を削除できませんでした。", "error");
    }
  };

  const handleDeleteButtonClick = () => {
    const selectedIds = selectedFlatRows.map((row) => row.original._id);
    if (selectedIds.length === 0) {
      Swal.fire("エラー", "削除する商品を選択してください。", "error");
      return;
    }

    Swal.fire({
      title: "確認",
      text: "本当に削除しますか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "はい",
      cancelButtonText: "いいえ",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSelected(selectedIds);
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setEditData((prev) => ({
      ...prev,
      image: [...prev.image, ...imagesWithPreview],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", editData.name);
    formData.append("price", editData.price);
    formData.append("category", editData.category);
    formData.append("mercari_uri", editData.mercari_uri);
    formData.append("description", editData.description);
    formData.append("status", editData.status);
    formData.append("gender", editData.gender);
    formData.append("color", editData.color);
    formData.append("stock", editData.stock);

    editData.image.forEach((img) => {
      if (img.file) {
        formData.append("image", img.file);
      } else {
        formData.append("existingImage", img);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://183.107.128.217:3000/api/products/${editRowId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("成功", "データが更新されました。", "success");
      fetchProducts();
      setEditRowId(null);
    } catch (error) {
      console.error("Failed to update product:", error);
      Swal.fire("エラー", "データを更新できませんでした。", "error");
    }
  };

  const handleEditClick = (row) => {
    setEditRowId((prevId) =>
      prevId === row.original._id ? null : row.original._id
    );

    setEditData((prevData) =>
      row.original._id === editRowId
        ? {
            name: "",
            price: "",
            category: "",
            mercari_uri: "",
            description: "",
            status: "",
            image: [],
            gender: "male",
            color: "red",
            stock: 0,
          }
        : {
            name: row.original.name,
            price: row.original.price,
            category: row.original.category,
            mercari_uri: row.original.mercari_uri,
            description: row.original.description || "",
            status: row.original.status || "",
            image: Array.isArray(row.original.image) ? row.original.image : [],
            gender: row.original.gender || "male",
            color: row.original.color || [],
            stock: row.original.stock || 0,
          }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => {
      let newValue = value;

      if (name === "stock") {
        const stockValue = parseInt(value, 10);
        if (stockValue < 0) return prev;
        newValue = stockValue;
      }

      return { ...prev, [name]: newValue };
    });
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage("");
  };

  const handleColorToggle = (selectedColor) => {
    setEditData((prev) => {
      const colorExists = prev.color.includes(selectedColor);
      const updatedColors = colorExists
        ? prev.color.filter((color) => color !== selectedColor)
        : [...prev.color, selectedColor];
      return { ...prev, color: updatedColors };
    });
  };

  const handleStockChange = (newStock) => {
    setEditData((prev) => {
      const updatedStock = Math.max(newStock, 0);
      const updatedStatus = updatedStock <= 1 ? "no" : prev.status;
      return {
        ...prev,
        stock: updatedStock,
        status: updatedStock <= 1 ? "no" : updatedStatus,
      };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-screen rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white text-gray-800 rounded-full p-2 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col p-4 space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          商品管理
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <span className="text-gray-600">
              商品数: <strong>{filteredCount}</strong>
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">すべてのカテゴリー</option>
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
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="検索..."
              className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-gray-600">
                表示件数:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <Link
              to="/admin/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              商品を追加
            </Link>

            <button
              onClick={handleDeleteButtonClick}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              削除する
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full table-auto bg-white text-sm border border-gray-300"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-indigo-600 text-white"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-2 text-left font-semibold border border-gray-300 whitespace-nowrap"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 ? (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        {...row.getRowProps()}
                        className="border-b border-gray-300"
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-4 py-2 border border-gray-300 whitespace-nowrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                      {editRowId === row.original._id && (
                        <tr>
                          <td colSpan={columns.length + 1}>
                            <div className="relative p-4 bg-gray-100 shadow rounded-lg">
                              <button
                                onClick={() => setEditRowId(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1 shadow"
                              >
                                ✕
                              </button>
                              <h3 className="text-lg font-semibold mb-4">
                                商品を編集
                              </h3>
                              <label className="block mb-4">
                                商品名:
                                <input
                                  type="text"
                                  name="name"
                                  value={editData.name}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </label>
                              <label className="block mb-4">
                                価格:
                                <input
                                  type="number"
                                  name="price"
                                  value={editData.price}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </label>
                              <label className="block mb-4">
                                カテゴリー:
                                <select
                                  name="category"
                                  value={editData.category}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                >
                                  <option value="MARNI バッグ">
                                    MARNI バッグ
                                  </option>
                                  <option value="AMI PARIS バッグ">
                                    AMI PARIS バッグ
                                  </option>
                                  <option value="MARC JACOBS バッグ">
                                    MARC JACOBS バッグ
                                  </option>
                                  <option value="Y-3 バッグ">Y-3 バッグ</option>
                                  <option value="A.P.C. バッグ">
                                    A.P.C. バッグ
                                  </option>
                                  <option value="Alexander Wang バッグ">
                                    Alexander Wang バッグ
                                  </option>
                                  <option value="その他 ブランドバッグ">
                                    その他 ブランドバッグ
                                  </option>
                                  <option value="アパレル">アパレル</option>
                                </select>
                              </label>
                              <label className="block mb-4">
                                画像:
                                <div className="mt-2 border border-dashed border-gray-300 p-4 rounded-md relative">
                                  <label
                                    htmlFor="imageUpload"
                                    className="flex flex-col items-center cursor-pointer text-indigo-600"
                                  >
                                    画像を追加
                                  </label>
                                  <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageUpload(e)}
                                    className="hidden"
                                  />

                                  <div className="mt-4 flex flex-col gap-4">
                                    {editData.image.map((img, index) => (
                                      <div
                                        key={index}
                                        className="relative flex items-center gap-4 border rounded-md p-2"
                                      >
                                        <span className="absolute top-0 left-0 bg-black text-white text-xs px-1 py-0.5 rounded">
                                          {index + 1}
                                        </span>
                                        <img
                                          src={
                                            img.preview ||
                                            `http://183.107.128.217:3000/${img}`
                                          }
                                          alt={`Product-${index + 1}`}
                                          className="w-20 h-20 rounded-md object-cover cursor-pointer"
                                        />
                                        <div className="flex flex-col gap-1">
                                          <button
                                            onClick={() =>
                                              handleMoveImage(index, "up")
                                            }
                                            disabled={index === 0}
                                            className={`px-2 py-1 bg-blue-500 text-white rounded ${
                                              index === 0 &&
                                              "opacity-50 cursor-not-allowed"
                                            }`}
                                          >
                                            上に移動
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleMoveImage(index, "down")
                                            }
                                            disabled={
                                              index ===
                                              editData.image.length - 1
                                            }
                                            className={`px-2 py-1 bg-green-500 text-white rounded ${
                                              index ===
                                                editData.image.length - 1 &&
                                              "opacity-50 cursor-not-allowed"
                                            }`}
                                          >
                                            下に移動
                                          </button>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditData((prev) => ({
                                              ...prev,
                                              image: prev.image.filter(
                                                (_, i) => i !== index
                                              ),
                                            }));
                                          }}
                                          className="px-2 py-1 bg-red-600 text-white rounded"
                                        >
                                          ✕ 削除
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </label>
                              <label className="block mb-4">
                                メルカリ URI:
                                <input
                                  type="text"
                                  name="mercari_uri"
                                  value={editData.mercari_uri}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                />
                              </label>
                              <label className="block mb-4">
                                説明:
                                <textarea
                                  name="description"
                                  value={editData.description}
                                  onChange={handleInputChange}
                                  className="w-full p-2 border border-gray-300 rounded"
                                ></textarea>
                              </label>
                              <label className="block mb-4">
                                性別:
                                <div className="flex gap-4 mt-2">
                                  {["male", "female", "unisex"].map(
                                    (gender) => (
                                      <label
                                        key={gender}
                                        className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 ${
                                          editData.gender === gender
                                            ? "border-indigo-600"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name="gender"
                                          value={gender}
                                          checked={editData.gender === gender}
                                          onChange={handleInputChange}
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
                                    )
                                  )}
                                </div>
                              </label>

                              <label className="block mb-4">
                                色:{" "}
                                <span className="ml-4 text-gray-600">
                                  {" "}
                                  {editData.color.join(", ") || "なし"}
                                </span>
                                <div
                                  className={`grid grid-rows-2 gap-2 mt-2`}
                                  style={{
                                    gridTemplateColumns:
                                      "repeat(5, minmax(0, 1fr))",
                                  }}
                                >
                                  {[
                                    { color: "red", bg: "bg-red-500" },
                                    { color: "orange", bg: "bg-orange-500" },
                                    { color: "yellow", bg: "bg-yellow-500" },
                                    { color: "green", bg: "bg-green-500" },
                                    { color: "blue", bg: "bg-blue-500" },
                                    { color: "navy", bg: "bg-[#001f3f]" },
                                    { color: "pink", bg: "bg-pink-500" },
                                    { color: "purple", bg: "bg-purple-500" },
                                    {
                                      color: "white",
                                      bg: "bg-white border-gray-300",
                                    },
                                    { color: "black", bg: "bg-black" },
                                  ].map(({ color, bg }) => (
                                    <button
                                      type="button"
                                      key={color}
                                      onClick={() => handleColorToggle(color)}
                                      className={`w-8 h-8 rounded-full ${bg} border-2 ${
                                        editData.color.includes(color)
                                          ? "border-black"
                                          : "border-transparent"
                                      }`}
                                      aria-label={color}
                                    ></button>
                                  ))}
                                </div>
                              </label>

                              <label className="block mb-4">
                                即購入可:
                                <div className="flex gap-4 mt-2">
                                  {/* 'はい' 버튼 */}
                                  <label
                                    className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 ${
                                      editData.status === "yes"
                                        ? "border-indigo-600"
                                        : "border-gray-300 opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="status"
                                      value="yes"
                                      disabled={editData.stock <= 1}
                                      checked={editData.status === "yes"}
                                      onChange={(e) =>
                                        setEditData((prev) => ({
                                          ...prev,
                                          status: e.target.value,
                                        }))
                                      }
                                      className="hidden"
                                    />
                                    <span>はい</span>
                                  </label>

                                  <label
                                    className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 ${
                                      editData.status === "no"
                                        ? "border-indigo-600"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="status"
                                      value="no"
                                      checked={editData.status === "no"}
                                      onChange={(e) =>
                                        setEditData((prev) => ({
                                          ...prev,
                                          status: e.target.value,
                                        }))
                                      }
                                      className="hidden"
                                    />
                                    <span>いいえ</span>
                                  </label>
                                </div>
                              </label>
                              <label className="block mb-4">
                                在庫数:
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStockChange(editData.stock - 1)
                                    }
                                    disabled={editData.stock <= 0}
                                    className={`px-3 py-2 bg-gray-300 text-gray-800 rounded-l-md ${
                                      editData.stock <= 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-400"
                                    }`}
                                  >
                                    -
                                  </button>

                                  <input
                                    type="number"
                                    name="stock"
                                    value={editData.stock}
                                    onChange={(e) =>
                                      handleStockChange(
                                        parseInt(e.target.value, 10)
                                      )
                                    }
                                    className="w-16 h-full px-3 py-2 text-center border-t border-b border-gray-300 rounded-none focus:outline-none focus:ring focus:ring-indigo-500"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleStockChange(editData.stock + 1)
                                    }
                                    className="px-3 py-2 bg-gray-300 text-gray-800 rounded-r-md hover:bg-gray-400"
                                  >
                                    +
                                  </button>
                                </div>
                              </label>
                              <button
                                onClick={(e) => handleUpdate(e)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              >
                                保存
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    検索された商品がありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800 hover:bg-indigo-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
