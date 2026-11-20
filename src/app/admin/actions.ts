"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export async function setCourseStatus(
  id: string,
  status: "published" | "rejected",
  rejectionReason?: string | FormData
) {
  const { sb } = await requireRole(["admin"]);
  const patch: Record<string, any> = { status };

  let reasonStr = "";
  if (typeof rejectionReason === "string") {
    reasonStr = rejectionReason.trim();
  } else if (rejectionReason && typeof rejectionReason === "object" && "get" in rejectionReason) {
    reasonStr = String(rejectionReason.get("reason") ?? "").trim();
  }

  if (status === "rejected") {
    patch.rejection_reason =
      reasonStr ||
      "Course does not meet Knowlix quality and curriculum guidelines.";
  } else {
    patch.rejection_reason = null;
  }

  let { error } = await sb.from("courses").update(patch).eq("id", id);

  // Fallback if rejection_reason column does not exist yet in DB
  if (error && error.message?.includes("rejection_reason")) {
    const fallback = await sb.from("courses").update({ status }).eq("id", id);
    error = fallback.error;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
}

export async function setUserRole(
  id: string,
  role: "student" | "instructor"
) {
  const { sb } = await requireRole(["admin"]);
  if (!["student", "instructor"].includes(role)) {
    throw new Error("Invalid role specified");
  }
  const { error } = await sb.from("profiles").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/instructors");
}

export async function toggleUserActive(
  userId: string,
  isActive: boolean
) {
  const { sb } = await requireRole(["admin"]);
  const { error } = await sb
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) {
    if (error.message?.includes("is_active")) {
      redirect(
        "/admin/students?error=" +
          encodeURIComponent(
            "Database missing 'is_active' column. Run the SQL in Supabase SQL Editor."
          )
      );
    }
    redirect("/admin/students?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath("/admin/instructors");
  redirect(
    "/admin/students?saved=" +
      encodeURIComponent(
        isActive ? "User activated successfully!" : "User deactivated!"
      )
  );
}
