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
      .select("id, status, listings(id, title, provider_id), requests(id, title, seeker_id)")
      .order("created_at", { ascending: false });
    setMatches(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const completar = async (matchId: string) => {
    const { error } = await supabase.from("matches").update({ status: "closed" }).eq("id", matchId);
    if (error) setStatus(error.message);
    else load();
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
      visible: true, // simplificado para el MVP — la regla de "revelar ambas o a los 7 días" queda pendiente
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
          <MatchCard key={m.id} match={m} userId={userId} onComplete={completar} onReview={calificar} />
        ))}
      </div>

      {status && <p className="text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}

function MatchCard({ match, userId, onComplete, onReview }: any) {
  const [score, setScore] = useState(5);
  const [message, setMessage] = useState("");

  return (
    <div className="card space-y-2">
      <p className="font-medium">{match.requests?.title}</p>
      <p className="text-sm text-gray-500">Servicio: {match.listings?.title}</p>
      <p className="text-sm text-gray-500">Estado: {match.status}</p>

      {match.status !== "closed" && (
        <button onClick={() => onComplete(match.id)}
          className="btn-primary btn-sm">
          Marcar como completado
        </button>
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
          <button onClick={() => onReview(match, score, message)}
            className="btn-primary btn-sm">
            Enviar calificación
          </button>
        </div>
      )}
    </div>
  );
}
