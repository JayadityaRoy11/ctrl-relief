import { Urgency, RequestStatus } from '../types';

export function getEta(distance?: number): string {
  if (!distance) return "~10 mins";
  return `~${Math.round(distance * 3)} mins`;
}

export function formatDist(d: number | string | undefined): string {
  if (d === undefined || d === null) return "N/A";
  const n = typeof d === "string" ? parseFloat(d) : d;
  if (isNaN(n)) return String(d);
  return `${n.toFixed(1)} km`;
}

export function getPriority(urgency: Urgency, distance?: number): { label: string; className: string } {
  if (urgency === "High" && (distance ?? 10) < 5) {
    return { label: "Critical", className: "bg-rose-600 text-white ring-1 ring-rose-700" };
  }
  return { label: "Standard", className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200" };
}
