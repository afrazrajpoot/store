import React, { useState } from 'react';

const CommentSection = () => {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState([
    {
      id: 1,
      user: 'Sarah M.',
      avatar: '/api/placeholder/32/32',
      date: '2 days ago',
      content: 'Absolutely love this product! The quality is outstanding and it fits perfectly.',
      likes: 24,
      replies: 3,
    },
    {
      id: 2,
      user: 'Michael R.',
      avatar: '/api/placeholder/32/32',
      date: '1 week ago',
      content: 'Great value for money. The material feels premium and the color is exactly as shown in the pictures.',
      likes: 18,
      replies: 1,
    }
  ]);

  return (
    <div className="mt-16 space-y-8">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-8">Customer Reviews</h2>
        
        <form className="mb-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full p-4 mb-4 min-h-[120px] rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Post Review
          </button>
        </form>

        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{comment.user}</h3>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">{comment.content}</p>

              <div className="flex items-center space-x-6 pt-2">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-sm">{comment.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm">{comment.replies} replies</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;