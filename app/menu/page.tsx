"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Menu() {
  const router = useRouter();
  const [roles, setRoles] = useState<string[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", userData.user.id)
        .single();
      setRoles(profile?.roles ?? []);
    };
    load();
  }, [router]);

  if (roles === null) return null;

  const isSeeker = roles.includes("seeker");
  const isProvider = roles.includes("provider");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Encuentra a quien resuelva tu problema en casa</h1>
        <p className="text-gray-600 mt-2">
          {isSeeker && isProvider
            ? "Tienes acceso tanto a pedir ayuda como a ofrecer tu servicio."
            : isProvider
            ? "Encuentra a quien necesita tu trabajo."
            : "Publica lo que necesitas y encuentra al especialista adecuado."}
        </p>
      </div>

      <div className={`grid gap-6 ${isSeeker && isProvider ? "sm:grid-cols-2" : ""}`}>
        {isSeeker && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-ink border-l-4 border-ink pl-2">Tengo una necesidad</h2>
            <a href="/publicar-necesidad" className="nav-link">Publicar una necesidad</a>
            <a href="/mis-necesidades" className="nav-link">Mis necesidades publicadas</a>
            <a href="/especialistas" className="nav-link">Ver especialistas disponibles</a>
          </section>
        )}

        {isProvider && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-accentDark border-l-4 border-accent pl-2">Ofrezco un servicio</h2>
            <a href="/publicar-servicio" className="nav-link">Publicar mi servicio</a>
            <a href="/solicitudes" className="nav-link">Ver necesidades abiertas</a>
          </section>
        )}
      </div>

      {!isSeeker && !isProvider && (
        <p className="text-gray-600 text-sm">
          Tu cuenta no tiene un rol asignado todavía. Contáctanos si esto no es lo esperado.
        </p>
      )}

      <a href="/mis-matches" className="nav-link block text-center">
        Mis matches y calificaciones
      </a>

      <a href="/agentes-test" className="block text-center text-xs text-gray-400 hover:text-accent">
        Probar infraestructura de agentes (interno)
      </a>
    </div>
  );
}
