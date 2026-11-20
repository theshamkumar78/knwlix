export type Role = "student" | "instructor" | "admin";

export type Course = {
  id: string;
  instructor_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  level: string;
  duration: string | null;
  status: string;
  what_you_will_learn?: string[] | null;
  profiles?: { full_name: string | null } | null;
  avg_rating?: number | null;
  reviews_count?: number | null;
};

export type Certificate = {
  id: string;
  student_id: string;
  course_id: string;
  code: string;
  issued_at: string;
  courses?: { title: string } | null;
  profiles?: { full_name: string | null } | null;
};

export type CourseReview = {
  id: string;
  course_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};
