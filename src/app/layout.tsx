"use client";
import '../components/assets/styles/main.scss';
import { Inter } from 'next/font/google'
import { useState, useEffect } from "react";
import Sidebar from '@/components/global/Sidebar/Sidebar';
import Header from '@/components/global/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main>
                <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
