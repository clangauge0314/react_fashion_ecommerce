import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-indigo-600 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-indigo-500">
          管理者 Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-indigo-500 transition-colors"
          >
            ホーム
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-indigo-500 transition-colors"
          >
            ユーザー管理
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-indigo-500 transition-colors"
          >
            レポート
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded hover:bg-indigo-500 transition-colors"
          >
            設定
          </a>
        </nav>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <h1 className="text-xl font-semibold text-gray-700">
            ダッシュボード
          </h1>
          <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            ログアウト
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ダッシュボード概要
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Cards */}
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">ユーザー数</h3>
              <p className="text-2xl font-semibold text-indigo-600">1,234</p>
            </div>
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">レポート数</h3>
              <p className="text-2xl font-semibold text-indigo-600">567</p>
            </div>
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">設定更新</h3>
              <p className="text-2xl font-semibold text-indigo-600">89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
