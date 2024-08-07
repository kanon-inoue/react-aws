import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = './Images/example.png'; 
  };

  const fetchPosts = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return; 
    }

    const url = `${import.meta.env.VITE_API_URL}/posts/?page=${page}`

    axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setPosts(posts => [...posts, ...response.data]);
        setHasMore(response.data.length > 0);
      })
      .catch(error => {
        console.error('Failed to fetch posts:', error);
        if (error.response.status === 401) {
          logout();
        }
      });
  }, [page, navigate, logout]);

  useEffect(() => {
    fetchPosts();
  }, [page, fetchPosts]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleNewPostSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    const postData = {
      content: newPostContent
    };
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
      if (response) {
        console.log(response)
      }
      setNewPostContent('');
      setPage(1)
      setHasMore(true)
      setPosts([])
      fetchPosts(); 
    } catch (error) {
      if (error.response.status === 401) {
        logout()
      }
      console.error('Error creating new post:', error);
    }
  };

  const observer = useRef();
  const lastPostElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(page => page + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div>

      <form onSubmit={handleNewPostSubmit}>
        <div className="new-post-container">
          <img className="profile-image" src={`${localStorage.getItem('user_image')}`} alt='Book' onError={handleImageError} />
         <input value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?" type="text" className="new-post-input" />
          <button type="submit" className="btn btn-primary">Post</button>
        </div>
      </form>
      <hr className="separator" />


      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return <div ref={lastPostElementRef} key={post.id} className="post-card">
            <div className="post-header">
              <p className="post-subtitle">
                <img className="profile-image" style={{ verticalAlign: "middle" }} src={`${post.image}`} alt='Profile' onError={handleImageError} />
                <span className="author-name">{post.first_name} {post.last_name}</span>
                <span className="post-metadata"> | {post.time_ago} |</span>
                <span className="view-dogs-metadata"> <Link to={`/dogs/${post.user_id}`} className="view-dogs-metadata">view dogs</Link></span>
              </p>
    
            </div>
            <p onClick={() => handlePostClick(post.id)} className="post-content">{post.content}</p>
            <div className="post-footer" onClick={() => handlePostClick(post.id)}>
              {post.comments_count === 0 ?
                "Be the first to comment" :
                `${post.comments_count} comments, show more`}
            </div>
          </div>
        } else {
          return <div key={post.id} className="post-card">
            <div className="post-header">
              <p className="post-subtitle">
                <img className="profile-image" style={{ verticalAlign: "middle" }} src={`${post.image}`} alt='Profile' onError={handleImageError} />
                <span className="author-name">{post.first_name} {post.last_name}</span>
                <span className="post-metadata"> | {post.time_ago}</span>
                <span className="view-dogs-metadata"> <Link to={`/dogs/${post.user_id}`} className="view-dogs-metadata">view dogs</Link></span>
              </p>
            </div>
            <p onClick={() => handlePostClick(post.id)} className="post-content">{post.content} </p>
            <div className="post-footer" onClick={() => handlePostClick(post.id)}>
              {post.comments_count === 0 ?
                "Be the first to comment" :
                `${post.comments_count} comments, show more`}
            </div>
          </div>
        }
      })}
    </div>
  );
}

export default PostsList;
