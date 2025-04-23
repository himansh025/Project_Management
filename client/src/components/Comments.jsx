import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import axios from "axios"; // Assuming you're using axios
import axiosInstance from "../config/apiconfig";

const Comments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Fetch comments for the task
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/comments/all/${taskId}`);
        console.log(response.data)
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);
  
  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const response = await axiosInstance.post('/comments', {
        content: newComment,
        taskId
      });
      
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  
  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      console.log(commentId)
    
      await axiosInstance.delete(`/comments/delete/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  
  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-medium text-sm mb-2">Comments</h4>
      
      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet</p>
      ) : (
        <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
          {comments?.map((comment) => (
            <div key={comment._id} className="flex text-sm p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium text-xs">
                  {comment.user?.name || "Unknown user"} • 
                  <span className="font-normal text-gray-500 ml-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
              
              {user && (user._id === comment.user._id || user.role === "admin") && (
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {user && (
        <form onSubmit={handleAddComment} className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded border p-2 text-sm"
              required
            />
            <button 
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Comments;