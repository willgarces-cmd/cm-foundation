"use client";

import { useEffect, useState } from "react";
import { Inbox, AlertTriangle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getCategoryIcon } from "@/config/category-icons";

function UrgenciaBadge({ nivel }: { nivel: string }) {
  if (nivel === "alta")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-red-600 rounded px-2 py-0.5">
        <AlertTriangle size={12} /> Urgente — hoy
      </span>
    );
  if (nivel === "media")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-ink bg-amber-400 rounded px-2 py-0.5">
        <Clock size={12} /> Urgencia media
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-green-600 rounded px-2 py-0.5">
      <CheckCircle2 size={12} /> Urgencia baja
    </span>
  );
}

export default function Solicitudes() {
  const [requests, setRequests] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      let listings: any[] = [];
      if (userData.user) {
        const { data } = await supabase
          .from("listings")
          .select("id, category_id")
          .eq("provider_id", userData.user.id);
        listings = data ?? [];
      }
      setMyListings(listings);

      const categoryIds = listings.map((l) => l.category_id);
      if (categoryIds.length > 0) {
        const { data: reqs } = await supabase
          .from("requests")
          .select("id, title, description, category_id, custom_fields, categories(name)")
          .eq("status", "open")
          .in("category_id", categoryIds)
          .order("created_at", { ascending: false });
        setRequests(reqs ?? []);
      }
      setLoaded(true);
    };
    load();
  }, []);

  const contactar = async (requestId: string, categoryId: string) => {
    setStatus(null);
    const listing = myListings.find((l) => l.category_id === categoryId);
    if (!listing) return;
    const { error } = await supabase.from("matches").insert({
      listing_id: listing.id,
      request_id: requestId,
    });
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Contacto enviado. Revisa 'Matches' para seguir.");
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  if (!loaded) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="page-title">Necesidades abiertas en tu especialidad</h1>

      {myListings.length === 0 && (
        <p className="text-gray-600 text-sm">
          Todavía no publicaste tu servicio, así que no sabemos en qué categoría mostrarte necesidades.{" "}
          <a href="/publicar-servicio" className="text-accent underline">Publica tu servicio primero</a>.
        </p>
      )}

      {myListings.length > 0 && requests.length === 0 && (
        <div className="flex flex-col items-center text-center gap-2 py-16 text-gray-400">
          <Inbox size={40} strokeWidth={1.5} />
          <p className="text-sm">No hay necesidades abiertas en tu especialidad por ahora.</p>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((r: any) => {
          const Icon = getCategoryIcon(r.categories?.name);
          return (
            <div key={r.id} className="card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">{r.categories?.name}</p>
                </div>
                <UrgenciaBadge nivel={r.custom_fields?.urgencia} />
              </div>
              <p className="font-medium">{r.description || r.title}</p>
              {(r.custom_fields?.ciudad || r.custom_fields?.distrito) && (
                <p className="text-sm text-gray-500">
                  {r.custom_fields?.distrito}
                  {r.custom_fields?.distrito && r.custom_fields?.ciudad ? ", " : ""}
                  {r.custom_fields?.ciudad}
                </p>
              )}
              <button onClick={() => contactar(r.id, r.category_id)} className="btn-primary btn-sm">
                Contactar con mi servicio
              </button>
            </div>
          );
        })}
      </div>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
