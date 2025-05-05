import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to manage your tasks"
      linkText="Don't have an account?"
      linkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;