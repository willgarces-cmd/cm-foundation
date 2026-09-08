import { supabase } from "@/lib/supabaseClient";
import BackLink from "@/components/BackLink";
import RatingBadge from "@/components/RatingBadge";

export const revalidate = 0;

export default async function Especialistas() {
  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, description, custom_fields, provider_id, categories(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const providerIds = (listings ?? []).map((l: any) => l.provider_id);
  const { data: ratings } = providerIds.length
    ? await supabase.from("provider_ratings").select("profile_id, avg_score, total_reviews").in("profile_id", providerIds)
    : { data: [] as any[] };

  const ratingByProvider: Record<string, { avg_score: number; total_reviews: number }> = {};
  (ratings ?? []).forEach((r: any) => {
    ratingByProvider[r.profile_id] = r;
  });

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
          {listings?.map((l: any) => {
            const rating = ratingByProvider[l.provider_id];
            const zonas: string[] = l.custom_fields?.zona_cobertura ?? [];
            return (
              <div key={l.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">{l.categories?.name}</p>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
