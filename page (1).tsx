"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";
import { LIMA_DISTRITOS } from "@/config/lima-districts";

const CATEGORY_SLUGS = ["plomeria", "electricidad", "pintura", "carpinteria", "cerrajeria", "gasfiteria", "jardineria"];

export default function PublicarServicio() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORY_SLUGS[0]);
  const [zonaCobertura, setZonaCobertura] = useState<string[]>([]);
  const [certificaciones, setCertificaciones] = useState("");
  const [portafolio, setPortafolio] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const toggleDistrito = (d: string) => {
    setZonaCobertura((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setStatus("Inicia sesión primero para publicar tu servicio.");
      return;
    }

    if (zonaCobertura.length === 0) {
      setStatus("Selecciona al menos un distrito de cobertura.");
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

    const { error } = await supabase.from("listings").insert({
      provider_id: userData.user.id,
      category_id: category.id,
      title,
      description,
      custom_fields: { zona_cobertura: zonaCobertura, certificaciones, portafolio },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Servicio publicado. Los usuarios de esa categoría podrán verte.");
    setTimeout(() => router.push("/menu"), 900);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="page-title">Publicar mi servicio</h1>

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
          <label className="block text-sm mb-1">Describe tu servicio</label>
          <textarea className="input-field" value={description}
            onChange={(e) => setDescription(e.target.value)} rows={4} required />
        </div>

        <div>
          <label className="block text-sm mb-2">Distritos donde das cobertura</label>
          <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto border border-line rounded-md p-3">
            {LIMA_DISTRITOS.map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={zonaCobertura.includes(d)}
                  onChange={() => toggleDistrito(d)} />
                {d}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Certificaciones (texto por ahora, fotos vienen después)</label>
          <input className="input-field" value={certificaciones}
            onChange={(e) => setCertificaciones(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Portafolio (texto o links por ahora)</label>
          <input className="input-field" value={portafolio}
            onChange={(e) => setPortafolio(e.target.value)} />
        </div>

        <button type="submit" className="btn-primary">
          Publicar servicio
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
