"use client";
import { useAuth } from "@/app/context/Context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

      useEffect(() => {
    // Só redireciona se não estiver autenticado e não estiver na página de login
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Se estiver na página de login, apenas renderiza os filhos
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Se não autenticado, não renderiza nada (ou pode mostrar um loading)
  if (!isAuthenticated) {
    return null;
  }

  // Se autenticado, renderiza normalmente
  return <>{children}</>;
}