import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [navigation, setNavigation] = useState({ prevPost: null, nextPost: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_API_URL}/api/post/${id}`);
        setPost(response.data.post);
        setNavigation(response.data.navigation);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) return <div>投稿が見つかりません。</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {post.isImportant && (
                <span className="px-4 py-1.5 text-sm font-semibold text-red-800 bg-red-100 rounded-full animate-pulse">
                  重要
                </span>
              )}
              <span className="text-gray-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              投稿番号: {post._id.slice(-6)}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            {post.content}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {(navigation.prevPost || navigation.nextPost) && (
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                {navigation.prevPost && (
                  <div 
                    className="p-4 hover:bg-gray-100 cursor-pointer transition duration-150"
                    onClick={() => navigate(`/post/${navigation.prevPost._id}`)}
                  >
                    <div className="text-sm text-gray-500 mb-2">← 前の記事</div>
                    <div className="text-gray-900 font-medium line-clamp-1">
                      {navigation.prevPost.title}
                    </div>
                  </div>
                )}
                {navigation.nextPost && (
                  <div 
                    className="p-4 hover:bg-gray-100 cursor-pointer transition duration-150"
                    onClick={() => navigate(`/post/${navigation.nextPost._id}`)}
                  >
                    <div className="text-sm text-gray-500 mb-2 text-right">次の記事 →</div>
                    <div className="text-gray-900 font-medium text-right line-clamp-1">
                      {navigation.nextPost.title}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;