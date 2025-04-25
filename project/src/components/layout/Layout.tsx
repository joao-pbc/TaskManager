import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" 
         style={{ 
           backgroundImage: 'url("https://images.pexels.com/photos/7103165/pexels-photo-7103165.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1")',
           backgroundSize: 'cover',
           backgroundAttachment: 'fixed'
         }}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-indigo-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Task Manager © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;