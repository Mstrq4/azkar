
import { useTranslations } from 'next-intl';
import PdfCard from '../components/PdfCardSleep'

function Sleep() {
  const t = useTranslations('sleep');

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-5xl font-bold text-center mb-12">
      {`${t('sleeptitl')} ${t('sleepdis')}`}
      </h1>
      <PdfCard />
    </main>
  )
}

export default Sleep