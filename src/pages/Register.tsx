import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
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
      title="Create Account"
      subtitle="Sign up to start managing your tasks"
      linkText="Already have an account?"
      linkTo="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;