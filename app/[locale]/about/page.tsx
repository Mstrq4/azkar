import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DownloadIcon, GlobeIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect';
import MagicButton from '@/components/MagicButton';
import { FaLocationArrow } from 'react-icons/fa6';
import data from '@/data/data.json'; // استيراد بيانات اللغات
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="flex w-full items-center justify-center mb-3">
            <Link href="/">
                <img className="absolute rotate-90 w-[450px] scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
                <img className="rotate-0 w-[450px] scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
            </Link>
        </div>

      {/* Hero Section */}
      <section className="mb-20">
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src="/images/islamic-background..svg"
            alt="خلفية إسلامية"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-white text-center">{t('aboutimg')}</h2>
          </div>
        </div>
      </section>

      {/* Mission and Features */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('aboutmasige')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t('aboutmasigefoll')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('aboutm')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>{t('aboutli1')}</li>
                <li>{t('aboutli2')}</li>
                <li>{t('aboutli3')}</li>
                <li>{t('aboutli4')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Languages Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('aboutlang')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.languages.map((lang) => (
            <Card key={lang.code} className="text-center">
              <CardContent className="pt-6">
                <GlobeIcon className="mx-auto mb-2" />
                <p>{lang.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* App Download Section */}
      <section className="mb-20 text-center">
        <h2 className="text-3xl font-bold mb-8">{t('aboutapp')}</h2>
        <p className="mb-6">{t('aboutappdisc')}</p>
        <div className="flex justify-center gap-4">
          <Button><DownloadIcon className="mr-2" />{t('aboutappandr')}</Button>
          <Button><DownloadIcon className="mr-2" />{t('aboutappaple')}</Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('aboutcotshintitle1')}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('aboutcotshintitle')}</AccordionTrigger>
            <AccordionContent>{t('aboutcotshindesc')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t('aboutcotshin1')}</AccordionTrigger>
            <AccordionContent>{t('aboutcotshin11')}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t('aboutcotshin2')}</AccordionTrigger>
            <AccordionContent>{t('aboutcotshin22')}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t('aboutcall')}</h2>
        <p className="mb-8">{t('aboutdisc')}</p>
        <Button size="lg"><BookOpenIcon className="mr-2" />{t('aboutdisc2')}</Button>
      </section>
    </div>
  );
}