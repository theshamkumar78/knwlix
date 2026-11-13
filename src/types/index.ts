export type Role = "student" | "instructor" | "admin";
export type Course = { id: string; instructor_id: string; title: string; slug: string; description: string | null; thumbnail_url: string | null; category: string | null; level: string; duration: string | null; status: string; profiles?: { full_name: string | null } | null };
