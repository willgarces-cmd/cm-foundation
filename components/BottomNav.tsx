"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ITEMS = [
  { href: "/menu", label: "Inicio", icon: Home },
  { href: "/mis-matches", label: "Matches", icon: MessageSquare },
  { href: "/cuenta", label: "Cuenta", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!loggedIn) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-center px-3 pb-3">
      <div className="max-w-2xl w-full bg-ink rounded-2xl shadow-lg flex justify-around items-center h-16">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <a key={href} href={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs rounded-2xl transition-colors ${
                active ? "text-accent" : "text-white/50 hover:text-white/80"
              }`}>
              <Icon size={24} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
