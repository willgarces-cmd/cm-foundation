"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getCategoryIcon } from "@/config/category-icons";

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

  if (!loaded) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="page-title">Mis necesidades publicadas</h1>

      {requests.length === 0 && (
        <div className="flex flex-col items-center text-center gap-2 py-16 text-gray-400">
          <ClipboardList size={40} strokeWidth={1.5} />
          <p className="text-sm">Todavía no has publicado ninguna necesidad.</p>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((r: any) => {
          const Icon = getCategoryIcon(r.categories?.name);
          return (
            <div key={r.id} className="card space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-500">{r.categories?.name}</p>
                </div>
                <span className="text-xs font-medium text-ink border border-line rounded px-2 py-0.5">
                  {ESTADO_LABELS[r.status] ?? r.status}
                </span>
              </div>
              <p className="font-medium">{r.description || r.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
