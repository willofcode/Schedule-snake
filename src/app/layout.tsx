import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import Navbar from "./Navbar";
=======
import Navbar from "../components/Navbar";

>>>>>>> 8682fdfcc38938f83c3bb7f6d02dfb2a50a7cb3f
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Schedule Snake",
  description: "Enroll with Schedule Snake",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
=======
    return (
        <html lang="en">
        <body className={`${inter.className} h-full`}>
        <Navbar />
        <main className="flex-grow pt-16 overflow-hidden">
            {children}
        </main>
        </body>
        </html>
    );
>>>>>>> 8682fdfcc38938f83c3bb7f6d02dfb2a50a7cb3f
}
