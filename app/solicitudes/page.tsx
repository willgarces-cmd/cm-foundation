"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Solicitudes() {
  const [requests, setRequests] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: listings } = await supabase
          .from("listings")
          .select("id, category_id, title")
          .eq("provider_id", userData.user.id);
        setMyListings(listings ?? []);
      }

      const { data: reqs } = await supabase
        .from("requests")
        .select("id, title, description, category_id, custom_fields, categories(name)")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setRequests(reqs ?? []);
    };
    load();
  }, []);

  const contactar = async (requestId: string, categoryId: string) => {
    setStatus(null);
    const listing = myListings.find((l) => l.category_id === categoryId);
    if (!listing) {
      setStatus("Primero publica tu servicio en esa categoría (ve a 'Publicar mi servicio').");
      return;
    }
    const { error } = await supabase.from("matches").insert({
      listing_id: listing.id,
      request_id: requestId,
    });
    setStatus(error ? error.message : "Contacto enviado. Revisa 'Mis matches' para seguir.");
  };

  return (
    <div className="space-y-4">
      <h1 className="page-title">Necesidades abiertas</h1>

      {requests.length === 0 && <p className="text-gray-600 text-sm">No hay necesidades abiertas por ahora.</p>}

      <div className="space-y-3">
        {requests.map((r: any) => (
          <div key={r.id} className="card space-y-2">
            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-gray-500">{r.categories?.name}</p>
            {r.description && <p className="text-sm text-gray-700">{r.description}</p>}
            <button onClick={() => contactar(r.id, r.category_id)}
              className="btn-primary btn-sm">
              Contactar con mi servicio
            </button>
          </div>
        ))}
      </div>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
