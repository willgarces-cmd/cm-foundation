"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

export default function Registro() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const toggleRole = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (roles.length === 0) {
      setStatus("Selecciona al menos un rol.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, roles } },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data.session) {
      setStatus("Cuenta creada y sesión iniciada.");
      setTimeout(() => router.push("/menu"), 800);
    } else {
      setStatus("Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.");
    }
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="page-title">Crear cuenta</h1>

      <div>
        <label className="block text-sm mb-1">Nombre completo</label>
        <input className="input-field" value={fullName}
          onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Correo</label>
        <input type="email" className="input-field" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Contraseña</label>
        <input type="password" className="input-field" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>

      <div>
        <label className="block text-sm mb-2">¿Cómo quieres usar la plataforma?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={roles.includes("seeker")}
              onChange={() => toggleRole("seeker")} />
            Tengo una necesidad (usuario)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={roles.includes("provider")}
              onChange={() => toggleRole("provider")} />
            Ofrezco un servicio (especialista)
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Crear cuenta
      </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
