'use client';

import { useAuth } from '@/lib/state/authContext';
import { Button } from './ui/Button';
import { LogOut, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-200 tracking-tight">
            TaskFlow
          </span>
        </Link>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={logout}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 rounded-xl"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border border-white/10 rounded-lg">
            <p>Log out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
