"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HeaderNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const syncSession = (session: any) => {
      setLoggedIn(!!session);
      setName(session?.user?.user_metadata?.full_name ?? null);
    };
    supabase.auth.getSession().then(({ data }) => syncSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loggedIn === null) return <nav className="text-sm h-5" />;

  return (
    <nav className="flex gap-4 text-sm items-center">
      {loggedIn ? (
        <>
          {name && <span className="text-ink font-medium truncate max-w-[100px] sm:max-w-none">Hola, {name.split(" ")[0]}</span>}
          <button onClick={cerrarSesion} className="text-gray-500 hover:text-accent">
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <a href="/login" className="text-ink hover:text-accent">Iniciar sesión</a>
          <a href="/registro" className="text-accent font-medium hover:text-accentDark">Crear cuenta</a>
        </>
      )}
    </nav>
  );
}
