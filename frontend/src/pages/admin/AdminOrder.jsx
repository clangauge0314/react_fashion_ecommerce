import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTable } from "react-table";
import Swal from "sweetalert2";

const OrderCard = ({ order, onStatusChange, onDelete }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="font-semibold text-lg">{order.customerName}</h3>
          <p className="text-gray-600">{order.customerEmail}</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className={`w-full sm:w-auto px-2 py-1 rounded text-sm ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            <option value="pending">処理待ち</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
          <button
            onClick={() => onDelete(order._id)}
            className="w-full sm:w-auto px-2 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            削除
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="font-medium">商品:</span>
          <p className="text-gray-600">{order.productId?.name}</p>
        </div>
        <div>
          <span className="font-medium">数量:</span>
          <p className="text-gray-600">{order.quantity}</p>
        </div>
        <div>
          <span className="font-medium">IP アドレス:</span>
          <p className="text-gray-600">{order.ipAddress}</p>
        </div>
        <div>
          <span className="font-medium">注文日時:</span>
          <p className="text-gray-600">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <span className="font-medium">更新日時:</span>
          <p className="text-gray-600">
            {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    } else {
      fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/order`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/order/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
      Swal.fire("成功", "ステータスが更新されました。", "success");
    } catch (error) {
      console.error("Failed to update status:", error);
      Swal.fire("エラー", "ステータスの更新に失敗しました。", "error");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const result = await Swal.fire({
        title: '削除確認',
        text: 'この注文を削除してもよろしいですか？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '削除',
        cancelButtonText: 'キャンセル'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_NODEJS_API_URL}/api/order/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        fetchOrders();
        
        Swal.fire(
          '削除完了',
          '注文を削除しました。',
          'success'
        );
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      Swal.fire(
        'エラー',
        '削除に失敗しました。',
        'error'
      );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    return selectedStatus === "all"
      ? orders
      : orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "顧客名", accessor: "customerName" },
      { Header: "メール", accessor: "customerEmail" },
      { 
        Header: "商品", 
        accessor: "productId.name",
        Cell: ({ row }) => (
          <a 
            href={`${import.meta.env.VITE_FRONTEND_URL}/product/${row.original.productId?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {row.original.productId?.name}
          </a>
        )
      },
      { Header: "数量", accessor: "quantity" },
      { Header: "IP アドレス", accessor: "ipAddress" },
      {
        Header: "ステータス",
        accessor: "status",
        Cell: ({ row }) => (
          <select
            value={row.original.status}
            onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
            className={`px-2 py-1 rounded ${
              row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              row.original.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            <option value="pending">処理待ち</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
        ),
      },
      {
        Header: "注文日時",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "操作",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteOrder(row.original._id)}
            className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            削除
          </button>
        ),
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
  } = useTable({ columns, data: filteredOrders });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <nav className="mt-8 space-y-4">
            <Link
              to="/admin/dashboard"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            >
              商品管理
            </Link>
            <Link
              to="/admin/contact"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            >
              お問い合わせ
            </Link>
            <Link
              to="/admin/order"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            >
              オーダー
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex flex-col p-4 space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            オーダー管理
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <span className="text-gray-600">
              総件数: <strong>{filteredOrders.length}</strong>
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <select
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              className="px-3 py-2 border border-gray-300 rounded shadow-sm"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">処理待ち</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded shadow-sm"
            >
              <option value="10">10件表示</option>
              <option value="25">25件表示</option>
              <option value="50">50件表示</option>
              <option value="100">100件表示</option>
            </select>
          </div>
        </div>

        <div className="hidden xl:block overflow-x-auto">
          <table {...getTableProps()} className="min-w-full bg-white border">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-50">
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-t">
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6">
          {paginatedOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteOrder}
            />
          ))}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
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
  );
}

export default AdminOrder;