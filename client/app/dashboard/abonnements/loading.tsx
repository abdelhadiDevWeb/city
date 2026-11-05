import { SkeletonKpiGrid, SkeletonTable, SkeletonHeader } from "../skeletons";

export default function AbonnementsLoading() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" />
      <SkeletonKpiGrid count={4} />
      <SkeletonTable columns={5} rows={5} />
    </div>
  );
}

