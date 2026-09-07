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
      <h1 className="page-title">Iniciar sesión</h1>

      <div>
        <label className="block text-sm mb-1">Correo</label>
        <input type="email" className="input-field" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Contraseña</label>
        <input type="password" className="input-field" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit" className="btn-primary">
        Entrar
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
