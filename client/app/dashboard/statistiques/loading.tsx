import { SkeletonKpiGrid, SkeletonHeader, SkeletonBox } from "../skeletons";
import { card } from "../ui";

export default function StatistiquesLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" />
      <SkeletonKpiGrid count={4} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${card} p-6 space-y-4`}>
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-64 w-full rounded-2xl" />
        </div>
        <div className={`${card} p-6 space-y-4`}>
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

