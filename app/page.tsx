"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
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
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden min-h-[75vh] shadow-warm">
        <HeroIllustration className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative flex flex-col items-center justify-center min-h-[75vh] px-6 py-16 text-center text-white">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-5">
            <ShieldCheck size={13} /> Catálogo Maestro
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold max-w-lg leading-[1.1]">
            Encuentra a quien resuelva tu problema en casa
          </h1>
          <p className="mt-4 text-white/80 max-w-sm text-lg">
            Especialistas en plomería, electricidad y más — o publica tu servicio si eres tú quien lo resuelve.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none">
            <a href="/registro"
              className="bg-accent text-white rounded-lg px-7 py-3.5 font-medium shadow-lg shadow-accent/30 hover:bg-accentDark hover:-translate-y-0.5 transition-all">
              Crear cuenta
            </a>
            <a href="/login"
              className="border border-white/60 text-white rounded-lg px-7 py-3.5 font-medium hover:bg-white hover:text-ink transition-colors">
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="font-serif text-lg text-ink">1. Publica o busca</p>
          <p className="text-sm text-gray-600 mt-1.5">Cuenta qué necesitas o publica tu servicio.</p>
        </div>
        <div className="card">
          <p className="font-serif text-lg text-ink">2. Conversa antes de decidir</p>
          <p className="text-sm text-gray-600 mt-1.5">Chatea dentro de la plataforma sin dar tus datos todavía.</p>
        </div>
        <div className="card">
          <p className="font-serif text-lg text-ink">3. Confirmen juntos</p>
          <p className="text-sm text-gray-600 mt-1.5">El contacto se comparte solo cuando ambos confirman.</p>
        </div>
      </div>

      <div className="border border-accent/30 bg-accent/[0.06] rounded-xl px-5 py-4 text-sm text-ink">
        <span className="font-semibold">Plataforma en fase piloto.</span>{" "}
        <span className="text-gray-700">
          Antes de recibir a un especialista en casa, verifica sus reseñas, pide referencias, y ante cualquier duda contáctanos.
        </span>
      </div>
    </div>
  );
}
