import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";

export const revalidate = 0;

export default async function Especialistas() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, description, custom_fields, categories(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="space-y-4">
        <h1 className="page-title">Especialistas disponibles</h1>

      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {!error && (!listings || listings.length === 0) && (
        <p className="text-gray-600 text-sm">Todavía no hay especialistas publicados.</p>
      )}

      <div className="space-y-3">
        {listings?.map((l: any) => (
          <div key={l.id} className="card">
            <p className="font-medium">{l.title}</p>
            <p className="text-sm text-gray-500">{l.categories?.name}</p>
            {l.description && <p className="text-sm text-gray-700 mt-1">{l.description}</p>}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
