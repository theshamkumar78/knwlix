import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import ChangePassword from "@/components/dashboard/ChangePassword";

export default async function Security() {
  const { profile } = await requireRole(["student", "instructor", "admin"]);
  return (
    <GlassShell active="profile" variant={profile.role}>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-extrabold">Account security</h1>
        <ChangePassword />
      </div>
    </GlassShell>
  );
}