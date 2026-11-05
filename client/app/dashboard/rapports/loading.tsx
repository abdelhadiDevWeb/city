import { SkeletonHeader, SkeletonBox } from "../skeletons";
import { card } from "../ui";

export default function RapportsLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" />
      <div className={`${card} p-4 flex items-center justify-between`}>
        <SkeletonBox className="h-9 w-64 rounded-xl" />
        <SkeletonBox className="h-9 w-32 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${card} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-10 w-10 rounded-xl" />
              <SkeletonBox className="h-5 w-16 rounded-md" />
            </div>
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

