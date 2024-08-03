// import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./provider";
import localFont from 'next/font/local'
import { ThemeLanguageProvider } from "@/components/ThemeLanguageProvider";

// تعريف الخط المحلي
const scheherazadeNew = localFont({
  src: '../public/fonts/Al-Jazeera-Light.ttf',
  variable: '--font-scheherazade'
})

export const metadata: Metadata = {
  title: "أذكار المسلم",
  description: "صحيح الأذكار المأثورة مترجمة لعدة لغات",
  keywords: "أذكار, إسلام, دعاء, ذكر, مسلم",
  openGraph: {
    title: "أذكار المسلم",
    description: "صحيح الأذكار المأثورة مترجمة لعدة لغات",
    url: "https://www.yourwebsite.com",
    siteName: "أذكار المسلم",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "أذكار المسلم",
    description: "صحيح الأذكار المأثورة مترجمة لعدة لغات",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.yourwebsite.com",
    languages: {
      'ar-SA': 'https://www.yourwebsite.com/ar',
      'en-US': 'https://www.yourwebsite.com/en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${scheherazadeNew.variable} font-sans`}>

          {children}

      </body>
    </html>
  );
}