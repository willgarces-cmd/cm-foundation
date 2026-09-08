"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Cuenta() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/");
        return;
      }
      setEmail(userData.user.email ?? null);
      setName(userData.user.user_metadata?.full_name ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", userData.user.id)
        .single();
      setRoles(profile?.roles ?? []);
    };
    load();
  }, [router]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const ROLE_LABELS: Record<string, string> = { seeker: "Usuario", provider: "Especialista" };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="page-title">Mi cuenta</h1>

      <div className="card flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center">
          <User size={26} />
        </div>
        <div>
          <p className="font-medium">{name ?? "Sin nombre"}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {roles.map((r) => (
          <span key={r} className="text-xs font-medium text-ink border border-line rounded-full px-3 py-1">
            {ROLE_LABELS[r] ?? r}
          </span>
        ))}
      </div>

      <button onClick={cerrarSesion}
        className="btn-outline w-full flex items-center justify-center gap-2">
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  );
}
