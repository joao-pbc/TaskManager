import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  linkText, 
  linkTo 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white bg-fixed bg-cover"
         style={{ backgroundImage: 'url("https://images.pexels.com/photos/7103165/pexels-photo-7103165.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1")' }}>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <BookOpenCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-800">{title}</h1>
          <p className="mt-2 text-center text-gray-600">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {linkText} <Link to={linkTo} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              {linkTo === '/login' ? 'Log in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;