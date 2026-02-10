"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FactorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/factor/home");
  }, [router]);
  return null;
}
