import MagicButton from '@/components/MagicButton';
import { Spotlight } from '@/components/ui/Spotlight'
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FaLocationArrow } from "react-icons/fa6";

export const Hero = () => {
  const t = useTranslations('Home');

  return (
    <div className="py-18">
      <div className="flex justify-center relative  z-10">
        <div className="max-w-[89vw] md:max-w-3xl lg:max-w-[60vw] flex flex-col my-9 items-center justify-center">
            <Link href="/">
                <img className="absolute rotate-90 w-[450px] scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
                <img className="rotate-0 w-[450px] scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
            </Link>
          <TextGenerateEffect
            words={t('TitleHomePage')}
            className="text-center text-[16px] md:text-[18px] lg:text-2xl my-9"
          />

          <a href="/" className='z-0'>
            <MagicButton
            
              icon={<FaLocationArrow className="hidden"/>}
              title={t('app')}
              position="left"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
