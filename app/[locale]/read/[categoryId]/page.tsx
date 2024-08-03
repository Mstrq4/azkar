// app/read/[categoryId]/page.tsx

import { notFound } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import data from '@/data/data.json';
import { useTranslations } from 'next-intl';

interface Dhikr {
  id: string;
  text: string;
  categoryId: string;
  languageId: string;
  translation?: string;
  repetitions: number;
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
  link?: string; // جعلنا خاصية link اختيارية
}

function getDhikrsByCategory(categoryId: string, languageCode: string): Dhikr[] {
  const arabicDhikrs = data.dhikrs.filter(dhikr => 
    dhikr.categoryId === categoryId && 
    data.languages.find(lang => lang.id === dhikr.languageId)?.code === "AR"
  );

  if (languageCode === "AR") {
    return arabicDhikrs;
  }

  const translatedDhikrs = data.dhikrs.filter(dhikr => 
    dhikr.categoryId === categoryId && 
    data.languages.find(lang => lang.id === dhikr.languageId)?.code === languageCode
  );

  return arabicDhikrs.map((arabicDhikr, index) => ({
    ...arabicDhikr,
    translation: translatedDhikrs[index]?.text
  }));
}

function getCategory(categoryId: string): Category | undefined {
  return data.categories.find(category => category.id === categoryId);
}

export default function ReadPage({ params, searchParams }: { 
  params: { categoryId: string }, 
  searchParams: { lang?: string }
}) {
  const { categoryId } = params;
  const languageCode = searchParams.lang || "AR";
  const category = getCategory(categoryId);
  const dhikrs = getDhikrsByCategory(categoryId, languageCode);

  if (!category || dhikrs.length === 0) {
    notFound();
  }
  const t = useTranslations('rbet');

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">{category.name}</h1>
      
      <div className="space-y-4">
        {dhikrs.map((dhikr) => (
          <Card key={dhikr.id}>
            <CardContent className="py-4 relative">
              <p className="my-4 text-2xl text-center leading-loose">{dhikr.text}</p>
              
              {dhikr.translation && languageCode !== "AR" && (
                <p className="text-center text-xl border-t-2 pt-4 text-gray-300">{dhikr.translation}</p>
              )}
              
              <span className="absolute top-2 right-2 text-sm text-gray-500">
                {dhikr.repetitions > 1 ? `${t('num')} ${dhikr.repetitions}` : ''}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // اجلب جميع المعرفات للفئات
  const categories = data.categories;

  // قم بإنشاء مسارات ثابتة لكل فئة
  const paths = categories.map(category => ({
    categoryId: category.id,
  }));

  return paths;
}
