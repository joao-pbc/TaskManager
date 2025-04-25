import React from 'react';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 min-h-[calc(100vh-16rem)]">
        <KanbanBoard />
      </div>
    </Layout>
  );
};

export default Dashboard;