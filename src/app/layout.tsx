import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { CompareBar } from "@/components/compare/CompareBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAMPUSIQ | College Discovery Platform",
  description: "An independent discovery engine, placement progression index, and qualitative audit compilation covering major higher education campuses in India.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23E8D5A3'/><text x='50' y='72' font-size='65' font-family='serif' font-weight='bold' text-anchor='middle' fill='%230A0A0A'>IQ</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="bg-background text-text-primary font-sans antialiased min-h-screen flex flex-col justify-between">
        <QueryProvider>
          <Navbar />
          <div className="flex-grow flex flex-col w-full">
            {children}
          </div>
          <CompareBar />
          <AuthModal />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

