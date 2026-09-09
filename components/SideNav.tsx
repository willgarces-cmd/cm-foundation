"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageSquare, User, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ITEMS = [
  { href: "/menu", label: "Inicio", icon: Home },
  { href: "/mis-matches", label: "Matches", icon: MessageSquare },
  { href: "/cuenta", label: "Cuenta", icon: User },
];

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!loggedIn) return null;

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="hidden lg:flex flex-col items-center gap-8 w-24 shrink-0 bg-ink py-8 sticky top-0 self-start h-screen">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <a key={href} href={href}
            className={`flex flex-col items-center gap-1.5 text-xs transition-colors ${
              active ? "text-accent" : "text-white/50 hover:text-white/80"
            }`}>
            <Icon size={24} strokeWidth={active ? 2.25 : 1.75} />
            {label}
          </a>
        );
      })}

      <div className="flex-1" />

      <button onClick={cerrarSesion}
        className="flex flex-col items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors">
        <LogOut size={22} strokeWidth={1.75} />
        Salir
      </button>
    </aside>
  );
}
