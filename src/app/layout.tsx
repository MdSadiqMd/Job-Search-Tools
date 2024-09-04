import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import TanstackProvider from "@/providers/tanstack.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scale.Jobs",
  description: "Apply on Scale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackProvider>
          <main>
            {children}
          </main>
        </TanstackProvider>
        <Toaster />
      </body>
    </html>
  );
}
