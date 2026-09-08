"use client";

import { Star } from "lucide-react";

export default function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} estrellas`}>
          <Star
            size={30}
            className={n <= value ? "fill-accent text-accent" : "text-gray-300"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
