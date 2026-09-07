"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import HeroIllustration from "@/components/HeroIllustration";

export default function Landing() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/menu");
      } else {
        setChecked(true);
      }
    });
  }, [router]);

  if (!checked) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[70vh]">
      <HeroIllustration className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/25" />
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 py-16 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-semibold max-w-md">
          Encuentra a quien resuelva tu problema en casa
        </h1>
        <p className="mt-3 text-white/80 max-w-sm">
          Especialistas en plomería, electricidad y más — o publica tu servicio si eres tú quien lo resuelve.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none">
          <a href="/registro"
            className="bg-accent text-white rounded-md px-6 py-3 font-medium hover:bg-accentDark transition-colors">
            Crear cuenta
          </a>
          <a href="/login"
            className="border border-white text-white rounded-md px-6 py-3 font-medium hover:bg-white hover:text-ink transition-colors">
            Iniciar sesión
          </a>
        </div>
      </div>
    </div>
  );
}
