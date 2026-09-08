"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ListChecks, Search, Briefcase, Inbox } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function Tile({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <a href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-white shadow-sm px-3 py-6 hover:border-accent hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center text-accentDark">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <span className="text-sm font-medium text-ink text-center">{label}</span>
    </a>
  );
}

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {isSeeker && isProvider ? "¿Qué necesitas hacer?" : isProvider ? "Tu espacio de trabajo" : "¿En qué te ayudamos?"}
        </h1>
      </div>

      {isSeeker && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-ink border-l-4 border-ink pl-2">Tengo una necesidad</h2>
          <div className="grid grid-cols-3 gap-3">
            <Tile href="/publicar-necesidad" icon={PlusCircle} label="Publicar necesidad" />
            <Tile href="/mis-necesidades" icon={ListChecks} label="Mis necesidades" />
            <Tile href="/especialistas" icon={Search} label="Ver especialistas" />
          </div>
        </section>
      )}

      {isProvider && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-accentDark border-l-4 border-accent pl-2">Ofrezco un servicio</h2>
          <div className="grid grid-cols-3 gap-3">
            <Tile href="/publicar-servicio" icon={Briefcase} label="Publicar servicio" />
            <Tile href="/solicitudes" icon={Inbox} label="Necesidades abiertas" />
          </div>
        </section>
      )}

      {!isSeeker && !isProvider && (
        <p className="text-gray-600 text-sm">
          Tu cuenta no tiene un rol asignado todavía. Contáctanos si esto no es lo esperado.
        </p>
      )}
    </div>
  );
}
