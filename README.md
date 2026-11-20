# Knowlix — University-Grade Learning Management System (LMS)

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1%20App%20Router-blue.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.0-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth%20%2B%20RLS-3ecf8e.svg)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **"Learn Without Limits. Grow Without Boundaries."**  
> Knowlix is a modern, university-grade open educational platform engineered to provide accessible, high-definition online learning, real-time student progress tracking, an instructor studio, administrative governance, and cryptographically verifiable digital certificates.

---

## 📑 11-Page Design Implementation Matrix

Knowlix has been designed and implemented in strict accordance with the **11-Page Visual UI/UX Specification**:

| Page # | Route | Screen Name | Visual Design & Features |
|---|---|---|---|
| **Page 1** | `/` | **Homepage** | Soft airy blue canvas, "Learn Without Limits" hero banner, `Explore Courses ->` CTA, 5 pastel category cards (Computer Science, Medical/MBBS, English, Mathematics, Business/BBA), and featured courses grid. |
| **Page 2** | `/courses` | **Courses Catalog** | "All Courses" heading, live search input, `Filter` button, active category pills, 3-column white cards with thumbnail, bookmark icon, lesson count, and star rating. |
| **Page 3** | `/courses/[slug]` | **Course Details** | Breadcrumbs navigation (`Home > Courses > [Title]`), embedded video player with play overlay, rating badge, `Enroll Now ->` and `Add to Wishlist` buttons, curriculum module accordion, and "Course Features" checklist card. |
| **Page 4** | `/dashboard` | **Student Dashboard** | Deep royal navy sidebar, "Welcome back, {Name}! 👋", 3 stat cards (Enrolled Courses, Completed Lessons, Certificates), weekly interactive activity bar chart, and "My Courses" with progress bars. |
| **Page 5** | `/instructor` | **Instructor Studio** | Navy sidebar, 3 stats (My Courses, Total Students, Total Earnings $0), course management list with `Manage ->` action, lesson reordering, and submission workflow. |
| **Page 6** | `/admin` | **Admin Dashboard** | Navy sidebar, 3 stats (Total Users, Total Courses, Total Instructors), platform activity stream, course audit approvals with rejection feedback, and CSV enrollment export. |
| **Page 7** | `/login` & `/signup` | **Auth Portal** | Split-screen layout: left 3D academic books illustration, right crisp card with segmented `[ Login ]` `[ Sign Up ]` tabs, live password validation, and social buttons. |
| **Page 8** | `/about` | **About Us** | "About Knowlix - Empowering learners worldwide", platform mission, laptop illustration, and 3 value pillars (Expert Instructors, Flexible Learning, Lifetime Access). |
| **Page 9** | `/contact` | **Contact & Support** | "Get In Touch", 3 direct contact cards (Email, Phone, Address), paper airplane accent, and interactive message dispatch form. |
| **Page 10** | `/faq` | **FAQ & Helpdesk** | "Frequently Asked Questions", interactive animated accordion answering enrollment, certification, refunds, and academic support questions. |
| **Page 11** | `/not-found` | **404 Error Page** | Crisp white card with graduation cap floating on bold blue "404", clean copy, and `Go Back Home ->` navigation pill. |

---

## 🎨 Visual Identity & Color System

- **Background Canvas:** Soft Slate `#f8fafc` and `#f4f7fb` (zero eye strain, clean daylight contrast).
- **Primary Brand:** Royal Blue `#2563eb` and `#1d4ed8` (clear, accessible, authoritative).
- **Dashboard Sidebar:** Deep Royal Navy `#072346` with white graduation cap logo and blue active pills.
- **Surfaces & Cards:** Crisp white cards (`#ffffff`) with subtle elevated shadows (`shadow-sm`, `shadow-md shadow-blue-500/5`), `rounded-2xl` borders (`border-slate-200/80`), and slate-900 typography.

---

## 🚀 Key Functional Capabilities

### 1. Student Learning Journey
- **One-Click Enrollment:** Seamless course enrollment with instant classroom activation.
- **Lesson Player:** Distraction-free video viewer utilizing privacy-enhanced `youtube-nocookie.com` and native HTML5 video controls (zero external video recommendations).
- **Progress Tracking:** Lesson-by-lesson completion toggles with persistent database state and weekly activity graphing.
- **Verifiable Certificates:** Automated generation upon 100% course completion featuring unique cryptographic verification codes and a public `/verify/[code]` portal.
- **Course Reviews:** Star ratings and written reviews by verified enrolled students.

### 2. Instructor Studio (`/instructor`)
- **Curriculum Builder:** Create courses, organize lessons into modules, drag/reorder lessons with up/down controls.
- **Course Lifecycle:** Draft → Submit for Review → Approved/Rejected.
- **Review Feedback Loop:** If rejected by admin, the instructor receives explicit rejection feedback directly in their dashboard to edit and resubmit.
- **Course Duplication:** One-click duplication to rapidly clone course outlines for new terms.
- **Student Preview Mode:** Inspect the classroom exactly as an enrolled student experiences it.

### 3. Administrative Control (`/admin`)
- **Course Approvals:** Audit pending courses with one-click Approve or structured Reject modal.
- **Role Management:** Promote/demote accounts between Student, Instructor, and Admin.
- **Account Moderation:** Deactivate/activate user accounts with immediate session enforcement.
- **Audit Reports:** One-click CSV export of student enrollments and completion statistics.

---

## 🛠️ Architecture & Tech Stack

```
knowlix/
├── src/
│   ├── app/                      # Next.js 15 App Router Routes
│   │   ├── page.tsx              # Page 1: Homepage
│   │   ├── courses/              # Page 2: Catalog & Page 3: Course Details
│   │   ├── dashboard/            # Page 4: Student Dashboard & Classroom
│   │   ├── instructor/           # Page 5: Instructor Dashboard & Studio
│   │   ├── admin/                # Page 6: Admin Dashboard
│   │   ├── login/ & signup/      # Page 7: Authentication Portal
│   │   ├── about/                # Page 8: About Us
│   │   ├── contact/              # Page 9: Contact Us
│   │   ├── faq/                  # Page 10: FAQ Accordion
│   │   ├── not-found.tsx         # Page 11: 404 Error
│   │   └── verify/[code]/        # Certificate Verification Engine
│   ├── components/               # Reusable Modular UI Components
│   │   ├── layout/               # NavbarClient, Footer
│   │   ├── courses/              # CourseCard, CourseLessonViewer, CourseReviewForm
│   │   └── dashboard/            # GlassShell, StudentDetailView
│   └── lib/supabase/             # Server & Client Supabase Clients with Cookie Store
└── supabase/
    ├── migrations/               # PostgreSQL Migrations (0001 - 0006)
    └── seed.sql                  # Comprehensive Demo Curriculum Dataset
```

---

## 🔒 Security & Row Level Security (RLS)

- **PostgreSQL Row Level Security (RLS):** Every table (`profiles`, `courses`, `lessons`, `enrollments`, `lesson_progress`, `certificates`, `course_reviews`) is protected by strict policies.
- **Secure Helper Functions:** Functions execute with `SECURITY DEFINER SET search_path = public` to eliminate search path injection vulnerabilities.
- **Environment Isolation:** Zero credentials leaked. All client secrets use `NEXT_PUBLIC_` prefixes with `.env.example` reference.

---

## 💻 Local Setup Instructions

### Prerequisites
- **Node.js:** v20.x or higher
- **Package Manager:** `npm` or `pnpm`
- **Database:** Free Supabase Project (PostgreSQL)

### 1. Clone & Install
```bash
git clone https://github.com/your-team/knowlix.git
cd knowlix
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Apply Migrations & Seed Data
Execute SQL files in Supabase **SQL Editor** in order:
1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_fix_rls.sql`
3. `supabase/migrations/0003_certificates.sql`
4. `supabase/migrations/0004_learning_experience.sql`
5. `supabase/migrations/0005_instructor_admin_upgrades.sql`
6. `supabase/migrations/0006_security_audit.sql`
7. `supabase/seed.sql` (Inserts courses matching the PDF design)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts for Competition Presentation

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Admin** | `admin@knowlix.com` | `Admin123456` | `/admin` (Course Approvals, Moderation, CSV Export) |
| **Instructor** | `instructor@knowlix.com` | `Instructor123` | `/instructor` (Curriculum Studio, Add Lessons) |
| **Student** | `student@knowlix.com` | `Student123456` | `/dashboard` (Learning Classroom, Certificates) |

---

## 🎤 6-Minute Live Competition Presentation Script

### Minute 0:00 – 1:00 | The Hook & Vision (Page 1)
- **Presenter:** *"Honorable judges, evaluators, and fellow engineers: Education is the single most powerful equalizer, yet traditional learning platforms suffer from high visual fatigue, cluttered interfaces, and complex navigation. We built Knowlix to solve this."*
- **Action:** Open Homepage (`/`). Highlight the clean, eye-friendly airy blue theme, the 5 popular category pastel cards, and featured course cards. Show how the visual hierarchy guides the student effortlessly.

### Minute 1:00 – 2:30 | Student Learning & Verifiable Certificates (Pages 2, 3, 4)
- **Presenter:** *"Let's explore how a student learns on Knowlix."*
- **Action:**
  1. Click on **Courses** (`/courses`). Demonstrate instant keyword search and category filtering.
  2. Click on **Python Programming (Beginner to Advanced)** (`/courses/basic-python`). Highlight breadcrumbs, video player, and course features checklist.
  3. Click **Enroll Now**. Jump directly into the **Student Dashboard** (`/dashboard`).
  4. Showcase the 3 clean stat cards, the weekly interactive activity chart, and click on the course to toggle a lesson as completed.
  5. Show the generated cryptographic certificate with its unique QR code and open `/verify/[code]` to prove instant authenticity.

### Minute 2:30 – 4:00 | Instructor Studio & Curriculum Management (Page 5)
- **Presenter:** *"An LMS is only as good as its teachers. Knowlix empowers university professors with a specialized Instructor Studio."*
- **Action:**
  1. Switch to the **Instructor Dashboard** (`/instructor`).
  2. Show the deep navy sidebar, stats, and course management list.
  3. Open a course, demonstrate adding a lesson with video URL, reordering lessons with up/down buttons, and previewing the course in **Student Preview Mode**.
  4. Click **Submit for Review**.

### Minute 4:00 – 5:00 | Admin Governance & Quality Control (Page 6)
- **Presenter:** *"To maintain university standards, courses cannot be published without academic peer review."*
- **Action:**
  1. Switch to the **Admin Dashboard** (`/admin`).
  2. Highlight the 3 metric cards, activity feed, and the **Pending Course Approvals** queue.
  3. Click **Approve** (or show the rejection modal with feedback).
  4. Click **Export CSV** to demonstrate instantaneous data reporting for university accreditation.

### Minute 5:00 – 6:00 | Architecture, Security & Conclusion
- **Presenter:** *"Under the hood, Knowlix is engineered with Next.js 15 App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL with strict Row Level Security (RLS) across all tables. Knowlix is accessible, fast, and ready for deployment."*
- **Action:** Conclude on the clean **About Us** (`/about`) and **FAQ** (`/faq`) pages. Open floor for judge Q&A.

---

## 📊 7-Slide Competition Presentation Outline

- **Slide 1: Title & Team:** Knowlix — Modern University-Grade Learning Management System. Team members, roles, and project mission.
- **Slide 2: The Problem:** Cognitive overload, high visual eye fatigue, fragmented student tracking, and unverified digital certificates in existing platforms.
- **Slide 3: The Solution (11-Page Design System):** The daylight-contrast light SaaS theme, deep navy royal sidebar, clean typography, and intuitive 3-role navigation.
- **Slide 4: Technical Architecture:** Next.js 15 App Router, React Server Components, TypeScript Strict Mode, Supabase Auth + PostgreSQL, and RLS security.
- **Slide 5: Core Innovations:** Distraction-free lesson streaming, automated cryptographic certificate issuance with online verification, and instructor-admin approval pipelines.
- **Slide 6: Security & Engineering Standards:** 0 TypeScript compile errors, SQL injection prevention via parameterized queries and `SECURITY DEFINER SET search_path = public`, and WCAG 2.1 AA accessibility.
- **Slide 7: Conclusion & Roadmap:** Production deployment, mobile app integration, and live demonstration.

---

## 📜 License
Distributed under the MIT License. Built with pride for university academic excellence.
