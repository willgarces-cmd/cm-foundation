import { Wrench, Zap, Paintbrush, Hammer, KeyRound, Flame, Sprout, HardHat, type LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Plomería": Wrench,
  "Electricidad": Zap,
  "Pintura": Paintbrush,
  "Carpintería": Hammer,
  "Cerrajería": KeyRound,
  "Gasfitería": Flame,
  "Jardinería": Sprout,
  "Albañilería": HardHat,
};

export function getCategoryIcon(name?: string): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Wrench;
}
