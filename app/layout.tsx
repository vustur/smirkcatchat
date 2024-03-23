import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const isAprilFirst = new Date().getMonth() === 3 && new Date().getDate() === 1;

export const metadata: Metadata = {
  title: isAprilFirst ? "Smirkcatchat?" : "Smirkcatchat",
  description: "Smirkcatchat",
  icon: isAprilFirst ? "/icon01-04.png" : "/icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={metadata.icon} type="image/x-icon"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
