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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-line flex justify-around items-center h-16 z-20">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <a key={href} href={href}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs ${
              active ? "text-accent" : "text-gray-400"
            }`}>
            <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
