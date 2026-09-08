import { SearchX } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RatingBadge from "@/components/RatingBadge";
import { getCategoryIcon } from "@/config/category-icons";

export const revalidate = 0;

export default async function Especialistas() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, description, custom_fields, provider_id, categories(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const ratingByProvider: Record<string, { avg_score: number; total_reviews: number }> = {};

  if (listings && listings.length > 0) {
    const providerIds = listings.map((l: any) => l.provider_id);
    const { data: ratings, error: ratingsError } = await supabase
      .from("provider_ratings")
      .select("profile_id, avg_score, total_reviews")
      .in("profile_id", providerIds);

    // Si la vista provider_ratings todavía no existe (falta correr el SQL),
    // simplemente no mostramos calificaciones — nunca debe tumbar la página.
    if (!ratingsError && ratings) {
      ratings.forEach((r: any) => { ratingByProvider[r.profile_id] = r; });
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="page-title">Especialistas disponibles</h1>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {!error && (!listings || listings.length === 0) && (
        <div className="flex flex-col items-center text-center gap-2 py-16 text-gray-400">
          <SearchX size={40} strokeWidth={1.5} />
          <p className="text-sm">Todavía no hay especialistas publicados.</p>
        </div>
      )}

      <div className="space-y-3">
        {listings?.map((l: any) => {
          const rating = ratingByProvider[l.provider_id];
          const zonas: string[] = l.custom_fields?.zona_cobertura ?? [];
          const Icon = getCategoryIcon(l.categories?.name);
          return (
            <div key={l.id} className="card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center shrink-0 text-ink">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">{l.categories?.name}</p>
                      <p className="font-medium">{l.title}</p>
                    </div>
                    <RatingBadge avgScore={rating?.avg_score} totalReviews={rating?.total_reviews} />
                  </div>
                  {l.description && <p className="text-sm text-gray-700 mt-2">{l.description}</p>}
                  {zonas.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Cobertura: {zonas.slice(0, 4).join(", ")}{zonas.length > 4 ? ` y ${zonas.length - 4} más` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
