import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import FixedBar from "./components/FixedBar";



export const metadata: Metadata = {
  title: "Gerencial - Sistema de Gestão",
  description: "Gerencial - Sistema de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <FixedBar/>
        {children}
      </body>
    </html>
  );
}
