import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTable } from "react-table";
import Swal from "sweetalert2";

const PostCard = ({ post, onDelete, onToggleImportant, onEdit }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-gray-600">{post.author}</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => onToggleImportant(post._id, !post.isImportant)}
            className={`px-3 py-1 rounded text-sm ${
              post.isImportant
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {post.isImportant ? "重要" : "通常"}
          </button>
          <button
            onClick={() => onEdit(post)}
            className="w-full sm:w-auto px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(post._id)}
            className="w-full sm:w-auto px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            削除
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>閲覧数: {post.viewCount}</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>
    </div>
  );
};

function AdminPost() {
  const [posts, setPosts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: 'admin',
    isImportant: false
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
    } else {
      fetchPosts();
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/post`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        Swal.fire(
          "エラー",
          "セッションが期限切れです。再ログインしてください。",
          "error"
        );
        navigate("/admin");
      }
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const result = await Swal.fire({
        title: '削除確認',
        text: 'この投稿を削除してもよろしいですか？',
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
          `${import.meta.env.VITE_NODEJS_API_URL}/api/post/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        fetchPosts();
        
        Swal.fire(
          '削除完了',
          '投稿を削除しました。',
          'success'
        );
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      Swal.fire(
        'エラー',
        '削除に失敗しました。',
        'error'
      );
    }
  };

  const handleToggleImportant = async (id, isImportant) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/post/${id}`,
        { isImportant },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
      Swal.fire("エラー", "更新に失敗しました。", "error");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/post`,
        newPost,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', author: '', isImportant: false });
      fetchPosts();
      Swal.fire('成功', '投稿が作成されました。', 'success');
    } catch (error) {
      console.error("Failed to create post:", error);
      Swal.fire('エラー', '投稿の作成に失敗しました。', 'error');
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_NODEJS_API_URL}/api/post/${editingPost._id}`,
        editingPost,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditModalOpen(false);
      setEditingPost(null);
      fetchPosts();
      Swal.fire('成功', '投稿が更新されました。', 'success');
    } catch (error) {
      console.error("Failed to update post:", error);
      Swal.fire('エラー', '投稿の更新に失敗しました。', 'error');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        Cell: ({ row }) => row.index + 1,
      },
      { Header: "タイトル", accessor: "title" },
      { Header: "著者", accessor: "author" },
      { 
        Header: "内容", 
        accessor: "content",
        Cell: ({ value }) => (
          <div className="max-w-xs truncate">{value}</div>
        )
      },
      { 
        Header: "重要", 
        accessor: "isImportant",
        Cell: ({ row }) => (
          <button
            onClick={() => handleToggleImportant(row.original._id, !row.original.isImportant)}
            className={`px-2 py-1 rounded ${
              row.original.isImportant ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.original.isImportant ? "重要" : "通常"}
          </button>
        )
      },
      { 
        Header: "閲覧数", 
        accessor: "viewCount" 
      },
      {
        Header: "作成日時",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: "操作",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditClick(row.original)}
              className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
            >
              編集
            </button>
            <button
              onClick={() => handleDeletePost(row.original._id)}
              className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
            >
              削除
            </button>
          </div>
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
  } = useTable({ columns, data: posts });

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sidebar */}
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
            <Link
              to="/admin/post"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
            >
              お知らせ
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
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
              お知らせ管理
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              新規作成
            </button>
          </div>
        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">新規投稿作成</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">タイトル</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="タイトルを入力してください"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">著者</label>
                  <input
                    type="text"
                    value={newPost.author || "admin"}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="著者名を入力してください"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">内容</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="投稿内容を入力してください"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPost.isImportant}
                    onChange={(e) => setNewPost({...newPost, isImportant: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    重要な投稿として設定
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    作成する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">投稿を編集</h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPost(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">タイトル</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">著者</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">内容</label>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPost.isImportant}
                    onChange={(e) => setEditingPost({...editingPost, isImportant: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    重要な投稿として設定
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingPost(null);
                    }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    更新する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <span className="text-gray-600">
              投稿件数: <strong>{posts.length}</strong>
            </span>
          </div>

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

        {/* Desktop Table View */}
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

        {/* Mobile Card View */}
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              onToggleImportant={handleToggleImportant}
              onEdit={handleEditClick}
            />
          ))}
        </div>

        {/* Pagination */}
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

export default AdminPost;