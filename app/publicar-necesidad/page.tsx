"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";
import { LIMA_DISTRITOS } from "@/config/lima-districts";

export default function PublicarNecesidad() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [distrito, setDistrito] = useState<string>(LIMA_DISTRITOS[0]);
  const [status, setStatus] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setStatus("Inicia sesión primero para publicar una necesidad.");
      return;
    }

    const title = description.length > 60 ? description.slice(0, 60) + "…" : description;

    const { error } = await supabase.from("requests").insert({
      seeker_id: userData.user.id,
      category_id: categoryId,
      title,
      description,
      custom_fields: { urgencia, ciudad: "Lima", distrito },
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
          <select className="input-field" value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
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
            <input className="input-field bg-gray-100 text-gray-500" value="Lima" disabled />
          </div>
          <div>
            <label className="block text-sm mb-1">Distrito</label>
            <select className="input-field" value={distrito}
              onChange={(e) => setDistrito(e.target.value)}>
              {LIMA_DISTRITOS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={!categoryId}>
          Publicar
        </button>

        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
