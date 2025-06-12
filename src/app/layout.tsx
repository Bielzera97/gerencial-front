import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/Context";
import AppShell from "./components/AppShell";

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
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
