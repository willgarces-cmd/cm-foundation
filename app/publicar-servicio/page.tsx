"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

const CATEGORY_SLUGS = ["plomeria", "electricidad", "pintura", "carpinteria", "cerrajeria", "gasfiteria", "jardineria"];

export default function PublicarServicio() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState(CATEGORY_SLUGS[0]);
  const [zonaCobertura, setZonaCobertura] = useState("");
  const [certificaciones, setCertificaciones] = useState("");
  const [portafolio, setPortafolio] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setStatus("Inicia sesión primero para publicar tu servicio.");
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
          <label className="block text-sm mb-1">Título de tu servicio</label>
          <input className="input-field" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea className="input-field" value={description}
            onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div>
          <label className="block text-sm mb-1">Zona de cobertura</label>
          <input className="input-field" value={zonaCobertura}
            onChange={(e) => setZonaCobertura(e.target.value)} required />
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
