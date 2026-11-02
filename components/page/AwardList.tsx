import type { Award } from "@/lib/types";

interface Props {
  awards: Award[];
  showWork?: boolean;
}

export default function AwardList({ awards, showWork = true }: Props) {
  return (
    <ul className="divide-y divide-gray-200">
      {awards.map((a) => (
        <li key={a.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3">
          <span className="w-12 shrink-0 text-sm font-bold text-gray-400">{a.year}</span>
          <span className="font-bold">{a.name}</span>
          {a.result ? (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">{a.result}</span>
          ) : null}
          {showWork && a.work ? <span className="text-gray-500">《{a.work}》</span> : null}
        </li>
      ))}
    </ul>
  );
}
