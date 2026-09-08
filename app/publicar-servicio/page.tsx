"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import CategoryPicker from "@/components/CategoryPicker";
import { LIMA_DISTRITOS } from "@/config/lima-districts";

export default function PublicarServicio() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [zonaCobertura, setZonaCobertura] = useState<string[]>([]);
  const [certificaciones, setCertificaciones] = useState("");
  const [portafolio, setPortafolio] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("vertical", "cm_smart_help")
        .order("name");
      setCategories(data ?? []);
      if (data && data[0]) setCategoryId(data[0].id);
    };
    loadCategories();
  }, []);

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

    const title = description.length > 60 ? description.slice(0, 60) + "…" : description;

    const { error } = await supabase.from("listings").insert({
      provider_id: userData.user.id,
      category_id: categoryId,
      title,
      description,
      custom_fields: { zona_cobertura: zonaCobertura, certificaciones, portafolio },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/menu"), 1100);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <CheckCircle2 size={48} className="text-green-600" />
        <p className="font-medium">Servicio publicado</p>
        <p className="text-sm text-gray-500">Los usuarios de esa categoría podrán verte.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="page-title">Publicar mi servicio</h1>

      <div>
        <label className="block text-sm mb-2">Categoría</label>
        <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
      </div>

      <div>
        <label className="block text-sm mb-1">Describe tu servicio</label>
        <textarea className="input-field" value={description}
          onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>

      <div>
        <label className="block text-sm mb-2">Distritos donde das cobertura</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-56 overflow-y-auto border border-line rounded-md p-3">
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

      <button type="submit" className="btn-primary w-full" disabled={!categoryId}>
        Publicar servicio
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
