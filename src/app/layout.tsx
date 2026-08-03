import type { Metadata, Viewport } from "next";
import { Figtree, Rethink_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts.scss";
import Footer from "@/components/system/Footer/Footer";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body-main",
  display: "swap",
});

const youth = localFont({
  src: "../../public/YouthBold.otf",
  variable: "--font-heading",
  display: "swap",
});


const formHead = localFont({
  src: "../../public/fonts/Penelope.woff2",
  variable: "--system-heading",
  display: "swap",
  weight: '400'
});

export const viewport: Viewport = {
  themeColor: "#000",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${rethinkSans.variable} ${figtree.variable}  ${formHead.variable} ${youth.variable}`}
      >
        {children}
        <Footer/>
      </body>
    </html>
  );
}