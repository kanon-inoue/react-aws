import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../App.css';

function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const {logout } = useAuth();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '../Images/example.png';
  };

  const fetchPostAndComments = useCallback(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate('/login');
      return;
    }
    const url = `${import.meta.env.VITE_API_URL}/posts/${postId}`

    axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error(`Error fetching post with id ${postId}:`, error);
        logout()
      });
  }, [navigate, postId, logout]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleBack = () => {
    navigate('/posts');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post(`${import.meta.env.VITE_API_URL}/comments/`,
      { content: newComment, post_id: postId }, // This is the data payload as the second argument
      {
        headers: { 'Authorization': `Bearer ${token}` } // This is the config object as the third argument
      }
    )
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment('');
        fetchPostAndComments();
      })
      .catch(error => {
        console.error('Error adding comment:', error);
        logout()
      });
  };
  return (
    <div className="card">
      {post && (
        <>
          <button onClick={handleBack} className="btn btn-back">
            <span className="arrow">&#8592;</span>
          </button>

          <div className="post-header">
            <p className="post-subtitle">
              <img className="profile-image" style={{ verticalAlign: "middle" }} src={`${post.user.image}`} alt='Profile' onError={handleImageError} />
              <span className="author-name">{post.user.first_name} {post.user.last_name}</span>
              <span className="post-metadata"> | {post.time_ago} | </span>
              <span className="view-dogs-metadata"> <Link to={`/dogs/${post.user_id}`} className="view-dogs-metadata">view dogs</Link></span>
            </p>
          </div>

          <p className="post-content">{post.content}</p>

          <form onSubmit={handleAddComment}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="new-comment-input"
            />
            <button type="submit" className="btn btn-primary">Add Comment</button>
          </form>

          <div className="comments-section">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <p className="comment-subtitle">
                    <img className="profile-image" style={{ verticalAlign: "middle" }} src={`${comment.user.image}`} alt='Profile' onError={handleImageError} />
                    <span className="author-name">{comment.user.first_name} {comment.user.last_name}</span>
                    <span className="post-metadata"> | {comment.time_ago} | </span>
                    <span className="view-dogs-metadata"> <Link to={`/dogs/${comment.user.id}`} className="view-dogs-metadata">view dogs</Link></span>
                  </p>
                  <p className="comment-content">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PostDetails;
