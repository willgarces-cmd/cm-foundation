"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    });
    setStatus(error ? error.message : "Si el correo existe, te enviamos un link para restablecer tu contraseña.");
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="page-title">Recuperar contraseña</h1>
        <p className="text-sm text-gray-600">
          Ingresa tu correo y te enviamos un link para crear una nueva contraseña.
        </p>

        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input type="email" className="input-field" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <button type="submit" className="btn-primary">
          Enviar link
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
