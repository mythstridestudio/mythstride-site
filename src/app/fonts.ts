import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";

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

export const documentFontClasses =
  `${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`;
