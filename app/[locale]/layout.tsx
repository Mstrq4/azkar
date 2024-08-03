import { Navbar } from "@/components/Navbar";
import { Footer } from "./components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeLanguageProvider } from "@/components/ThemeLanguageProvider";

// تحديد اللغات المدعومة
const locales = ['ar', 'en', 'fa', 'fr', 'hi', 'it', 'ja','pt','ur','zh', 'bn','cn','es', 'de', 'id', 'no', 'ro', 'ru', 'si', 'sk', 'sl', 'sv', 'tr', 'ur', 'vl'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // التحقق من أن اللغة المطلوبة مدعومة
  if (!locales.includes(locale)) notFound();

  // استيراد ملفات الترجمة من المسار الجديد
  let messages;
  try {
    messages = (await import(`@/public/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <ThemeLanguageProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main className="relative bg-white-100 dark:bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
              <Navbar />
              <div className="max-w-7xl w-full min-h-screen pt-20 pb-10 justify-center flex">
                {children}
              </div>
              <Footer />
            </main>
          </NextIntlClientProvider>
        </ThemeLanguageProvider>
      </body>
    </html>
  );
}

// تكوين الصفحات التي يجب أن تستخدم هذا التخطيط
export const metadata = {
  title: ' أذكار المسلم',
  description: 'صحيح اذكار المسلم',
};
