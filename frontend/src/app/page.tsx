"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-8 py-12">
        <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-tight">
          Achieve More, <span className="text-blue-400 drop-shadow-lg">Seamlessly.</span>
        </h1>
        <p className="text-xl text-gray-300 sm:text-2xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
          Your ultimate productivity companion. Organize tasks, conquer goals, and reclaim your time with an intuitive and powerful experience.
        </p>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            className="rounded-full px-12 py-7 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => router.push('/tasks')}
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </main>
  );
}
