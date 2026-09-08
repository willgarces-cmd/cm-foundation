"use client";

import { getCategoryIcon } from "@/config/category-icons";

export default function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {categories.map((c) => {
        const Icon = getCategoryIcon(c.name);
        const active = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors ${
              active
                ? "border-accent bg-accent/10 text-accentDark"
                : "border-line bg-white text-gray-600 hover:border-accent/50"
            }`}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="text-center leading-tight">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
