import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MythStride | Turn Your Runs Into RPG Battles",
  description:
    "MythStride transforms every real-world run into an epic dark fantasy progression journey. Fight bosses, earn rewards, complete quests, and grow stronger with every step.",
  keywords: ["running game", "fitness RPG", "dark fantasy", "mobile game", "run tracker", "gamified fitness"],
  openGraph: {
    title: "MythStride | Turn Your Runs Into RPG Battles",
    description:
      "MythStride transforms every real-world run into an epic dark fantasy progression journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-void text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
