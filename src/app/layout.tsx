import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Fabtech",
};

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: JSX.Element;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full h-fit relative z-0 antialiased bg-background">
            {children}
            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
