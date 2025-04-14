"use client";
import React from "react";
import { useAuth } from "@/services/authContext";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-blue-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Task Manager</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm font-medium">
                  Welcome, {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-sm">Please log in</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
