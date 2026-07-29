import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { documentFontClasses } from "@/app/fonts";
import { isPublicLocale, publicLocales } from "@/lib/locales";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      {
        url: "/apple-icon.png?v=3",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export function generateStaticParams() {
  return publicLocales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={documentFontClasses}
    >
      <body className="min-h-full bg-void font-body text-text-primary">
        {children}
      </body>
    </html>
  );
}
