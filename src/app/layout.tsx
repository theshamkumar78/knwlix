
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import FormGuard from "@/components/FormGuard";
import IntroScreen from "@/components/IntroScreen";

export const metadata: Metadata = {
  title: "Knowlix — Learn. Explore. Achieve.",
  description: "Online learning platform",
  icons: { icon: "/icon.png" },
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("knowlix-theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
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

      <body className="font-sans flex min-h-screen flex-col antialiased theme-page transition-colors duration-200">
        <ToastProvider>
          <IntroScreen />
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
