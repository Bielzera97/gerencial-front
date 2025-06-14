"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Tenta pegar a última rota salva
    const lastRoute = window.localStorage.getItem("lastRoute");
    if (lastRoute && lastRoute !== "/" && lastRoute !== "/login") {
      router.replace(lastRoute);
    } else {
      router.replace("/clients");
    }
  }, [router]);

  return (
    <main>
      Redirecionando...
    </main>
  );
}
