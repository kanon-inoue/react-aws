import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './posts/PostsList';
import PostDetails from './posts/PostDetails';
import Navbar from './nav/Navbar';
import LoginPage from './auth/LoginPage';
import RegisterPage from './register/RegisterPage';
import ProtectedRoute from './auth/ProtectedRoute';
import NotFound from './auth/NotFound';
import { AuthProvider } from './auth/AuthContext';
import UserDogs from './dogs/UserDogs';
import DogsAccount from './dogs/DogsAccount';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="custom-container">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:postId"
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <DogsAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dogs/:user_id"
              element={
                <ProtectedRoute>
                  <UserDogs />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
