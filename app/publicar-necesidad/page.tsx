"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import CategoryPicker from "@/components/CategoryPicker";
import { LIMA_DISTRITOS } from "@/config/lima-districts";

export default function PublicarNecesidad() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [distrito, setDistrito] = useState<string>(LIMA_DISTRITOS[0]);
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

    setSuccess(true);
    setTimeout(() => router.push("/menu"), 1100);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <CheckCircle2 size={48} className="text-green-600" />
        <p className="font-medium">Necesidad publicada</p>
        <p className="text-sm text-gray-500">Los especialistas de esa categoría podrán verla.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h1 className="page-title">Publicar una necesidad</h1>

      <div>
        <label className="block text-sm mb-2">Categoría</label>
        <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
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

      <button type="submit" className="btn-primary w-full" disabled={!categoryId}>
        Publicar
      </button>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
