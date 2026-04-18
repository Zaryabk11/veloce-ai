"use client";

import { signOut } from "next-auth/react";

interface TopNavProps {
  user: {
    name?: string | null;
    role?: string | null;
  };
}

export default function TopNav({ user }: TopNavProps) {
  return (
    <div className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">{user?.name}</span>
          <span className="text-xs text-indigo-600 font-semibold">{user?.role}</span>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}