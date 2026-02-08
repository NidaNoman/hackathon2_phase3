import { AuthProvider } from '@/lib/state/authContext';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="bg-gradient-to-br from-gray-950 via-slate-950 to-black font-poppins text-white">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
           <Header/>
            <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </main>
          </div>
        </AuthProvider>
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
