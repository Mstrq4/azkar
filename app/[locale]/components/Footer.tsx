// components/Footer.tsx

import { MessageCircle, Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('copyright')}{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Q4
            </a>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-4 w-4" />
            <span className="sr-only">واتساب</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Facebook className="h-4 w-4" />
            <span className="sr-only">واتساب</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Instagram className="h-4 w-4" />
            <span className="sr-only">واتساب</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">واتساب</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Button>
        </div>
      </div>
    </footer>
  )
}