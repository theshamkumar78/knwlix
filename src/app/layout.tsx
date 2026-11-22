
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import FormGuard from "@/components/FormGuard";

export const metadata: Metadata = {
  title: "Knowlix — Learn. Explore. Achieve.",
  description: "Online learning platform",
  icons: { icon: "/icon.png" },
};

const themeScript = `
  try {
    const s = localStorage.getItem('knowlix-theme');

    if (
      s === 'dark' ||
      (!s && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className="font-sans flex min-h-screen flex-col antialiased bg-[#f8fafc] text-slate-900 dark:bg-[#0b1329] dark:text-slate-100 transition-colors duration-200">
        <ToastProvider>
          <FormGuard />
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
