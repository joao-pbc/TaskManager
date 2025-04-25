import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, BookOpenCheck } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpenCheck size={28} />
          <h1 className="text-xl font-bold">Task Manager</h1>
        </div>
        
        {currentUser && (
          <div className="flex items-center">
            <span className="mr-4 hidden sm:inline-block">
              Welcome, {currentUser.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-indigo-700 hover:bg-indigo-800 py-1 px-3 rounded-md transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;