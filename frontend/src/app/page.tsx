"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Zap, Target, ArrowRight, Circle, CheckCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-indigo-300">AI-Powered Task Management</span>
        </div>

        {/* Main heading - LARGER */}
        <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
          Get Things Done,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Effortlessly.
          </span>
        </h1>

        {/* Subtitle - LARGER */}
        <p className="text-center text-lg sm:text-xl text-slate-300 max-w-lg mx-auto leading-relaxed mb-10">
          Your intelligent productivity companion. Organize tasks, stay focused, and conquer your goals with ease.
        </p>

        {/* CTA Buttons - BIGGER & MORE PROMINENT */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            className="group px-8 py-4 text-base font-bold bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1"
            onClick={() => router.push('/tasks')}
          >
            Start For Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="px-6 py-4 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200"
            onClick={() => router.push('/tasks')}
          >
            View Demo
          </Button>
        </div>

        {/* Enhanced Todo Preview Card */}
        <div className="mt-16 w-full max-w-md">
          <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-white font-semibold">Today's Tasks</p>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">2/3 Done</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-slate-300 line-through">Review project proposal</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-slate-300 line-through">Send weekly report</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                <Circle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">Plan tomorrow's tasks</span>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 text-center">Powered by AI to help you stay productive</p>
            </div>
          </div>
        </div>

        {/* Feature Cards - LARGER SIZE & BETTER SPACING */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 w-full max-w-3xl">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-5 border border-emerald-500/20">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Easy to Use</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Simple interface, powerful results</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-5 border border-indigo-500/20">
              <Target className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Stay Focused</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Track progress, hit your goals</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-5 border border-amber-500/20">
              <Zap className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI Powered</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Smart assistance when needed</p>
          </div>
        </div>
      </div>
    </main>
  );
}
