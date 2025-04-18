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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-[#0d1117] text-[#c9d1d9]`}>
        <div className="min-h-screen">
          <header className="fixed top-0 left-0 right-0 h-16 bg-[#161b22] border-b border-[#30363d] z-50">
            <div className="h-full flex items-center px-6">
              <h1 className="text-2xl font-bold text-[#c9d1d9]">Job Hunter</h1>
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
