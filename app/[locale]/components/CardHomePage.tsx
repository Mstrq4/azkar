import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import data from '@/data/data.json';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  link?: string;
}

export default function HomePage() {
  const t = useTranslations('Home');
  const tt = useTranslations('Buton');

  const categories: Category[] = data.categories;

  if (!categories || categories.length === 0) {
    return <div>{t('categorieserorr')}</div>;
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-5xl font-bold text-center mb-12">
      {`${t('categoriestitl')}  ${t('categoriesdis')}`}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category: Category) => (
          <Card 
            key={category.id} 
            className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105"
          >
            <CardHeader className="p-0 flex justify-center items-center">
              <div className="relative w-48 h-48"> {/* Fixed height */}
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  
                />
              </div>
            </CardHeader>
            <CardContent className=" text-center">
              <CardTitle className="text-2xl mb-3 font-bold">{category.name}</CardTitle>
              <CardDescription className="text-lg">{category.description}</CardDescription>
            </CardContent>
            <CardFooter className="px-6">
              <Link className='w-full' href={category.link || '/'}>
                <Button className="w-full text-lg py-6" variant="default">{tt('mor')}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}