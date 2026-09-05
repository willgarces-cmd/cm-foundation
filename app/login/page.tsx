"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : "Sesión iniciada.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-medium">Iniciar sesión</h1>

      <div>
        <label className="block text-sm mb-1">Correo</label>
        <input type="email" className="border rounded-lg w-full px-3 py-2" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Contraseña</label>
        <input type="password" className="border rounded-lg w-full px-3 py-2" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit" className="bg-gray-900 text-white rounded-lg px-4 py-2">
        Entrar
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
