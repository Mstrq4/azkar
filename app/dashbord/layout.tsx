'use client'

import { Inter } from "next/font/google";
import "@/app/globals.css"
import Header from "./components/Header";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from 'react';
import { ThemeLanguageProvider } from "@/components/ThemeLanguageProvider";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Sidebar } from "./components/SidBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const loginStatus = Cookies.get('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    if (!loginStatus) {
      router.push('/login');
    }

    return () => window.removeEventListener('resize', checkIfMobile);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('isLoggedIn');
    Cookies.remove('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (isLoggedIn === null) {
    return <ThemeLanguageProvider><div className="flex bg-white dark:bg-[#020817] justify-center items-center h-screen">جاري التحميل...</div></ThemeLanguageProvider>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} flex flex-col md:flex-row`}>
        <ThemeLanguageProvider>
          <Sidebar onLogout={handleLogout} />
          <main className={`flex-1 ${isMobile ? 'w-full' : 'md:mr-[250px]'}`}>
            <Header />
            <div className="p-4">
              {children}
            </div>
          </main>
          <Toaster />
        </ThemeLanguageProvider>
      </body>
    </html>
  );
}