// app/layout.jsx
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/redux/Providers";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { GlobalProvider } from "./context/GlobalState";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Toaster } from "sonner";

// Load Inter font for primary text
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Load local Geist font for accents and headings
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Roshni Store - Fashion Redefined",
  description:
    "Discover the latest trends in fashion at Roshni Store. Shop stylish and premium-quality clothing for every occasion.",
  keywords:
    "fashion, clothing, Roshni Store, trendy outfits, premium fashion, online shopping",
  author: "Roshni Store",
  openGraph: {
    title: "Roshni Store - Fashion Redefined",
    description:
      "Discover the latest trends in fashion at Roshni Store. Shop stylish and premium-quality clothing for every occasion.",
    url: "https://roshnistore.com",
    type: "website",
    images: [
      {
        url: "https://roshnistore.com/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Roshni Store - Fashion Redefined",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@roshnistore", // Replace with your Twitter handle if applicable
    title: "Roshni Store - Fashion Redefined",
    description:
      "Shop stylish and premium-quality clothing for every occasion at Roshni Store.",
    images: ["https://roshnistore.com/og-image.jpg"], // Replace with actual OG image URL
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} font-sans antialiased relative bg-white`}
      >
        <GlobalProvider>
          <Providers>
            <Header />
            <Toaster />
            <div>
              <Sidebar />
              {children}
            </div>
            <Footer />
          </Providers>
        </GlobalProvider>
      </body>
    </html>
  );
}
