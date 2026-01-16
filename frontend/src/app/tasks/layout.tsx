import { Header } from '@/components/Header';

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
            <div className="container mx-auto">
                {children}
            </div>
        </main>
    </div>
  );
}
