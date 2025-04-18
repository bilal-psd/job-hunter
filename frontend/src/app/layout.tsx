import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Hunter",
  description: "Find your next job opportunity with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen">
          <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="h-full flex items-center px-6">
              <h1 className="text-2xl font-bold text-gray-900">Job Hunter</h1>
            </div>
          </header>
          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
