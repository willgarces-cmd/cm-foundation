"use client";

import { useState } from "react";
import BackLink from "@/components/BackLink";

export default function AgentesTest() {
  const [mensaje, setMensaje] = useState("Preséntate en una frase como agente de prueba del foundation CM.");
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const probar = async () => {
    setLoading(true);
    setStatus(null);
    setRespuesta(null);
    try {
      const res = await fetch("/api/agents/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      });
      const data = await res.json();
      if (data.output?.error) {
        setStatus(data.output.error);
      } else {
        setRespuesta(data.output?.text ?? "Sin respuesta de texto.");
      }
    } catch (err: any) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="space-y-4">
        <h1 className="page-title">Probar la infraestructura de agentes</h1>
        <p className="text-sm text-gray-600">
          Página interna (no para usuarios finales) para confirmar que Vercel → Claude API →
          Supabase (<code>agent_logs</code>) funciona de punta a punta.
        </p>

        <textarea className="input-field" rows={3} value={mensaje}
          onChange={(e) => setMensaje(e.target.value)} />

        <button onClick={probar} disabled={loading} className="btn-primary">
          {loading ? "Consultando..." : "Probar agente"}
        </button>

        {respuesta && (
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Respuesta del agente:</p>
            <p>{respuesta}</p>
          </div>
        )}

        {status && <p className="text-sm text-red-600">{status}</p>}
      </div>
    </div>
  );
}
