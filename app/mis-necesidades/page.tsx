"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

const ESTADO_LABELS: Record<string, string> = {
  open: "Abierta — esperando especialista",
  matched: "Contactada",
  closed: "Cerrada",
};

export default function MisNecesidades() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("requests")
        .select("id, title, description, status, custom_fields, categories(name)")
        .eq("seeker_id", userData.user.id)
        .order("created_at", { ascending: false });
      setRequests(data ?? []);
      setLoaded(true);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="space-y-4">
        <h1 className="page-title">Mis necesidades publicadas</h1>

        {loaded && requests.length === 0 && (
          <p className="text-gray-600 text-sm">Todavía no has publicado ninguna necesidad.</p>
        )}

        <div className="space-y-3">
          {requests.map((r: any) => (
            <div key={r.id} className="card space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{r.categories?.name}</p>
                <span className="text-xs font-medium text-ink border border-line rounded px-2 py-0.5">
                  {ESTADO_LABELS[r.status] ?? r.status}
                </span>
              </div>
              <p className="font-medium">{r.description || r.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
