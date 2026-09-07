"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

const CATEGORY_SLUGS = ["plomeria", "electricidad", "pintura", "carpinteria", "cerrajeria", "gasfiteria", "jardineria"];

export default function PublicarNecesidad() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORY_SLUGS[0]);
  const [urgencia, setUrgencia] = useState("media");
  const [ciudad, setCiudad] = useState("");
  const [distrito, setDistrito] = useState("");
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
      .eq("vertical", "cm_smart_help")
      .eq("slug", categorySlug)
      .single();

    if (!category) {
      setStatus("No se encontró la categoría.");
      return;
    }

    const title = description.length > 60 ? description.slice(0, 60) + "…" : description;

    const { error } = await supabase.from("requests").insert({
      seeker_id: userData.user.id,
      category_id: category.id,
      title,
      description,
      custom_fields: { urgencia, ciudad, distrito },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Necesidad publicada. Los especialistas de esa categoría podrán verla.");
    setTimeout(() => router.push("/menu"), 900);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="page-title">Publicar una necesidad</h1>

      <div>
        <label className="block text-sm mb-1">Categoría</label>
        <select className="input-field" value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}>
          {CATEGORY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>{slug}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Cuéntanos qué necesitas</label>
        <textarea className="input-field" value={description}
          onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>

      <div>
        <label className="block text-sm mb-1">Urgencia</label>
        <select className="input-field" value={urgencia}
          onChange={(e) => setUrgencia(e.target.value)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta — necesito hoy</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Ciudad</label>
          <input className="input-field" value={ciudad}
            onChange={(e) => setCiudad(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Distrito</label>
          <input className="input-field" value={distrito}
            onChange={(e) => setDistrito(e.target.value)} required />
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Publicar
      </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
