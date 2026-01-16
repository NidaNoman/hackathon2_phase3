'use client';

import { useAuth } from '@/lib/state/authContext';
import { Button } from './ui/Button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between py-3 px-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-3xl font-extrabold text-white hover:text-blue-400 transition-colors duration-200 tracking-tight">
          TaskFlow
        </Link>
        <nav className="hidden md:flex items-center space-x-7">
          <Link href="/tasks" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-lg font-medium">
            Tasks
          </Link>
          <Link href="/completed" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-lg font-medium">
            Completed
          </Link>
          <Link href="/profile" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-lg font-medium">
            Profile
          </Link>
        </nav>
      </div>
      <Button 
        onClick={logout} 
        variant="ghost" 
        size="icon" 
        className="text-gray-300 hover:text-red-400 hover:bg-gray-700/50 transition-colors duration-200 rounded-full"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    </header>
  );
}
