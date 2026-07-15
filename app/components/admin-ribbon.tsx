import { auth } from "@/auth";
import {
  CalendarDays,
  FileImage,
  FileText,
  Home,
  LayoutDashboard,
  Languages,
  LogOut,
  Mail,
  Menu,
  Stethoscope,
  User,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "../admin/shared/logout-button";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Admin UI",
    href: "/admin/ui",
    icon: User,
  },
  {
    name: "Arabic Content",
    href: "/admin/arabic",
    icon: Languages,
  },
  {
    name: "Home UI",
    href: "/admin/home",
    icon: User,
  },
  {
    name: "Home",
    href: "/admin/home",
    icon: Home,
  },
  {
    name: "About",
    href: "/admin/about",
    icon: FileText,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Stethoscope,
  },
  {
    name: "Schedule",
    href: "/admin/schedule",
    icon: CalendarDays,
  },
  {
    name: "Staff",
    href: "/admin/staff",
    icon: UsersRound,
  },
  {
    name: "Contact",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    name: "Image Gallery",
    href: "/admin/gallery",
    icon: FileImage,
  },
  {
    name: "Navbar",
    href: "/admin/navbar",
    icon: Menu,
  },
];

export default async function AdminRibbon() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="sticky top-14 z-40 border-b border-gray-100 bg-gray-950 text-white shadow-lg lg:top-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <div className="flex gap-2 overflow-x-auto py-3">
          {adminLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-main-100"
              >
                <Icon size={15} strokeWidth={2.5} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <LogoutButton className="hidden shrink-0 items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-600 sm:flex">
          <LogOut size={15} strokeWidth={2.5} />
          Logout
        </LogoutButton>
      </div>
    </div>
  );
}
