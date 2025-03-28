import type { Metadata } from "next";
import { Nunito, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

// import {
//   ClerkProvider,
// } from "@clerk/nextjs";

const nunito = Nunito({
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100","300","400","500","600","700","800"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "",
  description: "Tedious SQL writing made easy with interactive AI-powered platform",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <Head>
          <link rel="shortcut icon" href="/logo.ico" type="image/x-icon" />
        </Head>
        <body
          className={`${poppins.style} ${jetbrains_mono.style} ${nunito.className}  antialiased overflow-hidden`}
        >
          {children}
        </body>
      </html>
  );
}
