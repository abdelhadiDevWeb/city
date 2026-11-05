import { SkeletonHeader, SkeletonBox } from "../skeletons";
import { card } from "../ui";

export default function AjouterResidenceLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${card} p-6 lg:col-span-2 space-y-4`}>
          <SkeletonBox className="h-5 w-48" />
          <div className="space-y-3">
            <SkeletonBox className="h-10 w-full rounded-xl" />
            <SkeletonBox className="h-10 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBox className="h-10 w-full rounded-xl" />
              <SkeletonBox className="h-10 w-full rounded-xl" />
            </div>
          </div>
          <SkeletonBox className="h-10 w-32 rounded-xl" />
        </div>
        <div className={`${card} p-6 space-y-3`}>
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

