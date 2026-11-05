import { SkeletonHeader, SkeletonBox } from "../skeletons";
import { card } from "../ui";

export default function ProfilLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-56" hasActions={false} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${card} p-6 space-y-4`}>
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <SkeletonBox className="h-5 w-32" />
              <SkeletonBox className="h-4 w-24 rounded-full" />
            </div>
          </div>
          <div className="border-t border-stone-100 pt-3 space-y-2">
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-3/4" />
          </div>
        </div>
        <div className={`${card} p-6 lg:col-span-2 space-y-4`}>
          <SkeletonBox className="h-5 w-40" />
          <div className="space-y-3">
            <SkeletonBox className="h-10 w-full rounded-xl" />
            <SkeletonBox className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

