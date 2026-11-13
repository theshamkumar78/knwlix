import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import StudentDetailView from "@/components/dashboard/StudentDetailView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);
  return (
    <GlassShell active="home" variant="instructor">
      <StudentDetailView sb={sb} studentId={id} instructorId={user.id} />
    </GlassShell>
  );
}