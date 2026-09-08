import { Star } from "lucide-react";

export default function RatingBadge({
  avgScore,
  totalReviews,
}: {
  avgScore?: number | string | null;
  totalReviews?: number | string | null;
}) {
  const score = Number(avgScore);
  const count = Number(totalReviews);

  if (!score || !count) {
    return <span className="text-xs text-gray-400 whitespace-nowrap">Sin calificaciones aún</span>;
  }

  return (
    <span className="text-sm font-medium text-ink whitespace-nowrap flex items-center gap-1">
      <Star size={15} className="text-accent fill-accent" />
      {score.toFixed(1)}
      <span className="text-gray-400 font-normal">({count})</span>
    </span>
  );
}
