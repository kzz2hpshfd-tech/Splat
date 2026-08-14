import type { Activity } from "@/lib/activities";

const CATEGORY_STYLE: Record<string, string> = {
  "Food & Drink": "from-splat-orange to-splat-pink",
  Outdoors: "from-splat-lime to-splat-cyan",
  Nightlife: "from-splat-purple to-splat-magenta",
  "Arts & Culture": "from-splat-cyan to-splat-purple",
  Chill: "from-splat-yellow to-splat-orange",
  Adventure: "from-splat-magenta to-splat-violet",
};

export default function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const gradient = CATEGORY_STYLE[activity.category] ?? "from-splat-pink to-splat-purple";

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-transform hover:-translate-y-1 hover:border-white/20"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-25 blur-2xl transition-opacity group-hover:opacity-40`}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`inline-block rounded-full bg-gradient-to-r ${gradient} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink`}
        >
          {activity.category}
        </span>
        <span className="text-xs font-bold text-white/50">{activity.priceTier}</span>
      </div>
      <h3 className="relative mt-3 font-display text-lg leading-snug text-white">{activity.title}</h3>
      <p className="relative mt-2 text-sm text-white/70">{activity.description}</p>
      <p className="relative mt-3 text-xs font-semibold text-splat-cyan">✨ {activity.whyItFits}</p>
    </div>
  );
}
