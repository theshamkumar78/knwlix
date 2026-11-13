import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import StudentDetailView from "@/components/dashboard/StudentDetailView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireRole(["admin"]);
  return (
    <GlassShell active="students" variant="admin">
      <StudentDetailView sb={sb} studentId={id} />
    </GlassShell>
  );
}