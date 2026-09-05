"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CM_SMART_HELP } from "@/config/verticals/cm-smart-help";

const CATEGORY_SLUGS = ["plomeria", "electricidad", "pintura", "carpinteria", "cerrajeria", "gasfiteria", "jardineria"];

export default function PublicarNecesidad() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORY_SLUGS[0]);
  const [urgencia, setUrgencia] = useState("media");
  const [presupuesto, setPresupuesto] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setStatus("Inicia sesión primero para publicar una necesidad.");
      return;
    }

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("vertical", CM_SMART_HELP.vertical)
      .eq("slug", categorySlug)
      .single();

    if (!category) {
      setStatus("No se encontró la categoría. Verifica que el schema.sql ya corrió en Supabase.");
      return;
    }

    const { error } = await supabase.from("requests").insert({
      seeker_id: userData.user.id,
      category_id: category.id,
      title,
      description,
      custom_fields: { urgencia, presupuesto, ubicacion },
    });

    setStatus(error ? error.message : "Necesidad publicada. Los especialistas de esa categoría podrán verla.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-xl font-medium">Publicar una necesidad</h1>

      <div>
        <label className="block text-sm mb-1">Categoría</label>
        <select className="border rounded-lg w-full px-3 py-2" value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}>
          {CATEGORY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>{slug}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Título</label>
        <input className="border rounded-lg w-full px-3 py-2" value={title}
          onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea className="border rounded-lg w-full px-3 py-2" value={description}
          onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div>
        <label className="block text-sm mb-1">Urgencia</label>
        <select className="border rounded-lg w-full px-3 py-2" value={urgencia}
          onChange={(e) => setUrgencia(e.target.value)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta — necesito hoy</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Presupuesto estimado (S/)</label>
        <input className="border rounded-lg w-full px-3 py-2" value={presupuesto}
          onChange={(e) => setPresupuesto(e.target.value)} placeholder="ej. 100-200" />
      </div>

      <div>
        <label className="block text-sm mb-1">Ubicación (comuna/zona)</label>
        <input className="border rounded-lg w-full px-3 py-2" value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)} required />
      </div>

      <button type="submit" className="bg-gray-900 text-white rounded-lg px-4 py-2">
        Publicar
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
