import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'صفحة الاتصال بنا. نحن هنا لمساعدتك والإجابة على استفساراتك.',
};

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center mb-12">{t('CardTitle')}</h1>
      <ContactForm />
    </main>
  );
}