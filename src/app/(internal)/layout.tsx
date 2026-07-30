import type { Metadata } from "next";
import "../globals.css";
import { documentFontClasses } from "@/app/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function InternalRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={documentFontClasses}
      >
        <body className="flex min-h-full flex-col bg-void font-body text-text-primary">
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
