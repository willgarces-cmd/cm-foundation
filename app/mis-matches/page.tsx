"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

export default function MisMatches() {
  const [userId, setUserId] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setUserId(userData.user.id);

    const { data } = await supabase
      .from("matches")
      .select(`
        id, status, provider_confirmed, seeker_confirmed, direccion_exacta,
        listings(id, title, provider_id),
        requests(id, title, seeker_id)
      `)
      .order("created_at", { ascending: false });
    setMatches(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const completar = async (matchId: string) => {
    const { error } = await supabase.from("matches").update({ status: "closed" }).eq("id", matchId);
    if (error) setStatus(error.message);
    else load();
  };

  const confirmarContratacion = async (matchId: string) => {
    const { error } = await supabase.rpc("confirmar_contratacion", { match_id_input: matchId });
    if (error) setStatus(error.message);
    else load();
  };

  const guardarDireccion = async (matchId: string, direccion: string) => {
    const { error } = await supabase.from("matches").update({ direccion_exacta: direccion }).eq("id", matchId);
    if (error) setStatus(error.message);
    else load();
  };

  const guardarTelefono = async (telefono: string) => {
    const { error } = await supabase.rpc("set_my_phone", { telefono });
    if (error) setStatus(error.message);
  };

  const calificar = async (match: any, score: number, message: string) => {
    if (!userId) return;
    const isProvider = match.listings.provider_id === userId;
    const recipientId = isProvider ? match.requests.seeker_id : match.listings.provider_id;

    const { error } = await supabase.from("reviews").insert({
      match_id: match.id,
      author_id: userId,
      recipient_id: recipientId,
      score,
      message,
      visible: true, // simplificado para el MVP
    });
    setStatus(error ? error.message : "Calificación enviada.");
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="space-y-4">
        <h1 className="page-title">Mis matches</h1>

        {matches.length === 0 && <p className="text-gray-600 text-sm">Todavía no tienes matches.</p>}

        <div className="space-y-4">
          {matches.map((m: any) => (
            <MatchCard key={m.id} match={m} userId={userId}
              onComplete={completar} onReview={calificar}
              onConfirm={confirmarContratacion}
              onSaveAddress={guardarDireccion}
              onSavePhone={guardarTelefono} />
          ))}
        </div>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}

function MatchCard({ match, userId, onComplete, onReview, onConfirm, onSaveAddress, onSavePhone }: any) {
  const isProvider = match.listings.provider_id === userId;
  const myConfirmed = isProvider ? match.provider_confirmed : match.seeker_confirmed;
  const otherConfirmed = isProvider ? match.seeker_confirmed : match.provider_confirmed;

  const [score, setScore] = useState(5);
  const [message, setMessage] = useState("");
  const [direccion, setDireccion] = useState(match.direccion_exacta ?? "");
  const [telefono, setTelefono] = useState("");
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [contacto, setContacto] = useState<{ nombre: string; telefono: string | null; direccion: string | null } | null>(null);

  useEffect(() => {
    const loadMsgs = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });
      setMsgs(data ?? []);
    };
    loadMsgs();
  }, [match.id]);

  useEffect(() => {
    if (match.status !== "active") return;
    const loadContacto = async () => {
      const { data } = await supabase.rpc("obtener_contacto", { match_id_input: match.id });
      if (data && data[0]) setContacto(data[0]);
    };
    loadContacto();
  }, [match.id, match.status, match.direccion_exacta]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    const { error } = await supabase.from("messages").insert({
      match_id: match.id,
      sender_id: userId,
      content: nuevoMensaje,
    });
    if (!error) {
      setMsgs((prev) => [...prev, { id: Math.random(), sender_id: userId, content: nuevoMensaje }]);
      setNuevoMensaje("");
    }
  };

  const handleGuardarTelefono = async () => {
    await onSavePhone(telefono);
    setPhoneSaved(true);
  };

  return (
    <div className="card space-y-3">
      <div>
        <p className="font-medium">{match.requests?.title}</p>
        <p className="text-sm text-gray-500">Servicio: {match.listings?.title}</p>
        <p className="text-sm text-gray-500">Estado: {match.status}</p>
      </div>

      <div className="border-t pt-2 space-y-2">
        <p className="text-sm font-medium">Conversación</p>
        <div className="max-h-40 overflow-y-auto space-y-1 bg-paper rounded-md p-2">
          {msgs.length === 0 && <p className="text-xs text-gray-400">Todavía no hay mensajes.</p>}
          {msgs.map((msg) => (
            <div key={msg.id} className={msg.sender_id === userId ? "text-right" : "text-left"}>
              <span className={`inline-block text-sm px-2 py-1 rounded-md ${
                msg.sender_id === userId ? "bg-ink text-white" : "bg-white border border-line"
              }`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-field" placeholder="Escribe un mensaje..." value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()} />
          <button onClick={enviarMensaje} className="btn-primary btn-sm">Enviar</button>
        </div>
      </div>

      {match.status !== "closed" && (
        <div className="border-t pt-2 space-y-2">
          {match.status === "active" ? (
            <div className="text-sm space-y-2">
              <p className="font-medium text-green-700">Contratación confirmada por ambas partes</p>
              {contacto ? (
                <>
                  <p>Contacto: {contacto.nombre}</p>
                  {contacto.telefono && <p>Teléfono: {contacto.telefono}</p>}
                  {contacto.direccion && <p>Dirección: {contacto.direccion}</p>}
                </>
              ) : (
                <p className="text-gray-400">Cargando datos de contacto...</p>
              )}

              {!isProvider && !match.direccion_exacta && (
                <div className="flex gap-2">
                  <input className="input-field" placeholder="Tu dirección exacta" value={direccion}
                    onChange={(e) => setDireccion(e.target.value)} />
                  <button onClick={() => onSaveAddress(match.id, direccion)} className="btn-primary btn-sm">
                    Guardar
                  </button>
                </div>
              )}

              {isProvider && !phoneSaved && (
                <div className="flex gap-2">
                  <input className="input-field" placeholder="Tu teléfono de contacto" value={telefono}
                    onChange={(e) => setTelefono(e.target.value)} />
                  <button onClick={handleGuardarTelefono} className="btn-primary btn-sm">
                    Guardar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm">
              {myConfirmed ? (
                <p className="text-gray-500">Ya confirmaste. Esperando confirmación de la otra parte.</p>
              ) : (
                <button onClick={() => onConfirm(match.id)} className="btn-primary btn-sm">
                  Confirmar contratación
                </button>
              )}
              {otherConfirmed && !myConfirmed && (
                <p className="text-gray-500 mt-1">La otra parte ya confirmó, falta tu confirmación.</p>
              )}
            </div>
          )}

          <button onClick={() => onComplete(match.id)} className="btn-outline btn-sm">
            Marcar como completado
          </button>
        </div>
      )}

      {match.status === "closed" && (
        <div className="border-t pt-2 space-y-2">
          <p className="text-sm font-medium">Calificar</p>
          <select className="input-field btn-sm w-auto" value={score}
            onChange={(e) => setScore(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrellas</option>)}
          </select>
          <textarea className="input-field" rows={2}
            placeholder="Mensaje opcional" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={() => onReview(match, score, message)} className="btn-primary btn-sm">
            Enviar calificación
          </button>
        </div>
      )}
    </div>
  );
}
