import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PdfFile {
  id: string;
  name: string;
  language: string;
  category: string;
  url: string;
  imageUrl: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  link: string;
}

async function getData() {
  const res = await fetch('http://localhost:3000/api/getData', { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function PdfCardPage() {
  const { pdfFiles, languages, categories } = await getData();

  const getLanguageName = (id: string) => {
    return languages.find((lang: { id: string; }) => lang.id === id)?.name || 'غير معروف';
  };

  const getCategoryName = (id: string) => {
    return categories.find((cat: { id: string; }) => cat.id === id)?.name || 'غير معروف';
  };

  const getLanguageCode = (id: string) => {
    return languages.find((lang: { id: string; }) => lang.id === id)?.code || 'ar'; // Default to Arabic if not found
  };

  // فلترة الملفات لعرض فقط تصنيف "أذكار الصباح والمساء"
  const morningEveningFiles = pdfFiles.filter((pdf: PdfFile) => 
    getCategoryName(pdf.category).toLowerCase() === 'أذكار الصباح والمساء'
  );

  if (morningEveningFiles.length === 0) {
    return <div>لا توجد ملفات متاحة لتصنيف أذكار الصباح والمساء.</div>;
  }

  return (
    <div className="w-full mt-12 grid lg:grid-cols-3 text-center grid-cols-1 gap-5">
      {morningEveningFiles.map((pdf: PdfFile) => (
        <Card key={pdf.id} className="w-full dark:bg-slate-900 dark:text-white bg-slate-200 text-slate-900">
          <CardHeader>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-40 mb-4">
              <Image
                src={pdf.imageUrl}
                alt={pdf.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </div>
            <p className="text-xl mb-1 truncate">
              {getLanguageName(pdf.language)}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-2">
            <Button
              className="w-full"
              variant="outline"
              asChild
            >
              <a 
                href={pdf.url} 
                download={`${pdf.name}.pdf`}
              >
                تحميل الملف
              </a>
            </Button>
            <Link 
              href={`/read/${pdf.category}?lang=${getLanguageCode(pdf.language)}`} 
              className="w-full"
            >
              <Button className="w-full" variant="default">
                قراءة
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}