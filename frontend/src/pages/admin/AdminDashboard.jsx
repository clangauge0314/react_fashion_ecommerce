// AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTable } from "react-table";
import Swal from "sweetalert2";

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    } else {
      fetchProducts();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      Swal.fire("成功", "商品が削除されました。", "success");
    } catch (error) {
      console.error("Failed to delete product:", error);
      Swal.fire("エラー", "商品を削除できませんでした。", "error");
    }
  };

  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Price", accessor: "price" },
      { Header: "Category", accessor: "category" },
      { Header: "Description", accessor: "description" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteProduct(row.original._id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: products });

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="flex flex-col flex-1 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          商品管理
        </h2>

        <Link
          to="/admin/create"
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full md:w-auto text-center"
        >
          商品を追加
        </Link>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white text-sm md:text-base"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gray-200"
                >
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="p-4 text-left">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-t">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-4">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
