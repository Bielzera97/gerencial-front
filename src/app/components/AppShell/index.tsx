"use client";
import Navbar from "../Navbar";
import FixedBar from "../FixedBar";
import PrivateRoute from "../PrivateRoute";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <FixedBar />}
      <PrivateRoute>{children}</PrivateRoute>
    </>
  );
}