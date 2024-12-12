import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_API_URL}/api/post`);
      const sortedPosts = response.data.sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
          return b.isImportant ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setLoading(false);
    }
  };

  // Get current posts
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">お知らせ</h2>
      
      <div className="mb-4 flex justify-end">
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value={10}>10件表示</option>
          <option value={25}>25件表示</option>
          <option value={50}>50件表示</option>
        </select>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">閲覧数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPosts.map((post) => (
              <tr 
                key={post._id} 
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.isImportant ? (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                      重要
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                      通常
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${post.isImportant ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.viewCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: Math.ceil(posts.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${currentPage === index + 1
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }
                ${index === 0 ? 'rounded-l-md' : ''}
                ${index === Math.ceil(posts.length / itemsPerPage) - 1 ? 'rounded-r-md' : ''}
              `}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NoticeBoard;