import { useTranslations } from 'next-intl';
import PdfCard from '../components/pdfFiles'

export default function Morning() {
  const t = useTranslations('morning-evening');

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-5xl font-bold text-center mb-12">
        {`${t('morningtitl')} ${t('morningdis')}`}
      </h1>
      <PdfCard />
    </main>
  );
}