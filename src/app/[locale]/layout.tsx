import { SessionWrapper } from "@/components/SessionWrapper";
import { LocaleHtmlLang } from "@/components/LocaleHtmlLang";
import { HeroBg } from "@/components/HeroBg";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SessionWrapper>
        <LocaleHtmlLang />
        <div className="relative min-h-screen">
          <HeroBg />
          <div className="relative z-10">{children}</div>
        </div>
      </SessionWrapper>
    </NextIntlClientProvider>
  );
}
