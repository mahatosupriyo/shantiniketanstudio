import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const youth = localFont({
  src: "../../public/YouthBold.otf",
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${rethinkSans.variable} ${youth.variable}`}
      >
        {children}
      </body>
    </html>
  );
}