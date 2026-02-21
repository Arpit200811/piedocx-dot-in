import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on sub-pages, not the landing page
  if (location.pathname === '/' || location.pathname === '/home') return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-24 md:top-28 left-4 md:left-8 z-[999] flex items-center p-2.5 bg-white/70 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 group cursor-pointer"
      aria-label="Back"
      title="Go Back"
    >
      <ArrowLeft className="text-gray-700 group-hover:text-blue-600 w-5 h-5 stroke-[2px]" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-20 group-hover:ml-2 transition-all duration-300 text-sm font-semibold text-gray-700 group-hover:text-pink-600 whitespace-nowrap">
        Back
      </span>
    </button>
  );
};

export default BackButton;
