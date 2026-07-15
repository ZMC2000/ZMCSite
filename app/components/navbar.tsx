"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Clock, MapPin, Menu, Phone, X } from "lucide-react";

import navbarData from "../data/navbar.json";
import arabicNavbarData from "../data/ar/navbar.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const { logo, emergency, location, hours, links, appointment } =
    useLocalizedData(navbarData, arabicNavbarData);

  const languageSwitcher = (mobile = false) => (
    <div
      className={`flex items-center rounded-full border font-bold shadow-sm ${
        mobile
          ? "border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700"
          : "ms-4 border-white/30 bg-white/10 px-3 py-2 text-xs text-white"
      }`}
      aria-label="Language selector"
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-1.5 py-0.5 transition ${
          language === "en"
            ? mobile
              ? "bg-main-100 text-white"
              : "bg-white text-main-100"
            : "opacity-70 hover:opacity-100"
        }`}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="mx-1 opacity-50" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={`rounded-full px-1.5 py-0.5 text-sm transition ${
          language === "ar"
            ? mobile
              ? "bg-main-100 text-white"
              : "bg-white text-main-100"
            : "opacity-70 hover:opacity-100"
        }`}
        aria-pressed={language === "ar"}
        aria-label="التبديل إلى العربية"
      >
        ع
      </button>
    </div>
  );

  return (
    <>
      {/* Upper Navbar - Desktop Only */}
      <header className="hidden w-full bg-white lg:block">
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                priority
                className="h-auto w-46.25 object-contain"
              />
            </Link>

            {/* Desktop Info */}
            <div className="flex items-center gap-6">
              <div className="border-r border-gray-300 pr-6">
                <p className="text-xs font-semibold text-main-100">
                  {emergency.label}
                </p>

                <p
                  dir="ltr"
                  className="phone-number mt-0.5 text-sm font-bold text-main-100"
                >
                  {emergency.phone}
                </p>
              </div>

              <div className="flex items-center gap-3 border-r border-gray-300 pr-6">
                <div className="flex h-9 w-9 items-center justify-center text-main-100">
                  <MapPin size={27} strokeWidth={2.4} />
                </div>

                <div className="text-xs font-medium leading-5 text-gray-600">
                  <p>{location.line1}</p>
                  <p>{location.line2}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center text-main-100">
                  <Clock size={27} strokeWidth={2.4} />
                </div>

                <div className="text-xs font-medium leading-5 text-gray-600">
                  <p>{hours.line1}</p>
                  <p>{hours.line2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Lower Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md lg:bg-main-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          {/* Desktop Links */}
          <div className="hidden items-center lg:flex">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-4 text-sm font-bold uppercase text-white transition hover:bg-black/10 ${
                    isActive ? "border-b-4 border-white bg-black/10" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* <Link
              href={appointment.href}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold uppercase text-white transition hover:bg-black/10 ${
                pathname.startsWith(appointment.href)
                  ? "border-b-4 border-white bg-black/10"
                  : ""
              }`}
            >
              <CalendarDays size={18} strokeWidth={2.5} />
              {appointment.name}
            </Link> */}
          </div>

          <div className="hidden lg:block">{languageSwitcher()}</div>

          {/* Mobile Logo */}
          <Link href="/" className="flex items-center py-2 lg:hidden">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-auto w-36.25 object-contain sm:w-40"
            />
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            {languageSwitcher(true)}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-12 w-12 items-center justify-center text-main-100"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X size={30} strokeWidth={2.5} />
              ) : (
                <Menu size={30} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="border-t border-gray-100 bg-white lg:hidden">
            <div className="flex flex-col px-5 py-3 shadow-md">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`border-b border-gray-100 py-4 text-sm font-bold uppercase transition ${
                      isActive
                        ? "bg-main-100/10 pl-3 text-main-100"
                        : "text-gray-700 hover:text-main-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* <Link
                href={appointment.href}
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-main-100 px-5 py-3 text-center text-sm font-bold uppercase text-white transition hover:bg-main-100/90"
              >
                <CalendarDays size={18} strokeWidth={2.5} />
                {appointment.name}
              </Link> */}

              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-main-100" />
                  <span>
                    {location.line1}, {location.line2}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-main-100" />
                  <span>{hours.line1}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-main-100" />
                  <span dir="ltr" className="phone-number">
                    {emergency.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
