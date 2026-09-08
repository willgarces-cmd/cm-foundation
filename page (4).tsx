"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ActualizarPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password.length < 6) {
      setStatus("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setStatus("Las contraseñas no coinciden.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Contraseña actualizada.");
    setTimeout(() => router.push("/menu"), 900);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="page-title">Crear nueva contraseña</h1>

        <div>
          <label className="block text-sm mb-1">Nueva contraseña</label>
          <input type="password" className="input-field" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirmar contraseña</label>
          <input type="password" className="input-field" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
        </div>

        <button type="submit" className="btn-primary">
          Guardar nueva contraseña
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
