import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  Languages,
  LogOut,
  Mail,
  Menu,
  Stethoscope,
  UsersRound,
} from "lucide-react";


const adminCards = [
  {
    title: "Arabic Content",
    description: "Edit categorized Arabic JSON content for every website page.",
    href: "/admin/arabic",
    icon: Languages,
  },
  {
    title: "Home",
    description: "Edit homepage sections and content.",
    href: "/admin/home",
    icon: Home,
  },
  {
    title: "About",
    description: "Edit about page text and sections.",
    href: "/admin/about",
    icon: FileText,
  },
  {
    title: "Services",
    description: "Edit departments and services.",
    href: "/admin/services",
    icon: Stethoscope,
  },
  {
    title: "Schedule",
    description: "Edit doctors, categories, and schedules.",
    href: "/admin/schedule",
    icon: CalendarDays,
  },
  {
    title: "Staff",
    description: "Edit staff members and roles.",
    href: "/admin/staff",
    icon: UsersRound,
  },
  {
    title: "Contact",
    description: "Edit phone numbers, email, location, and contact text.",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    title: "Navbar",
    description: "Edit navigation links and top bar info.",
    href: "/admin/navbar",
    icon: Menu,
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <main className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
              <LayoutDashboard size={15} strokeWidth={2.5} />
              Admin Dashboard
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              Website Content Manager
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-gray-600">
              Manage Zarif Medical Center website content from JSON based admin
              pages.
            </p>
          </div>

        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-main-100/15"
              >
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-main-100 text-white shadow-lg shadow-main-100/20 transition group-hover:scale-105">
                  <Icon size={29} strokeWidth={2.4} />
                </div>

                <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-950">
                  {card.title}
                </h2>

                <p className="mt-3 text-sm font-medium leading-7 text-gray-600">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
