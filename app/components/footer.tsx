"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import footerData from "../data/footer.json";
import arabicFooterData from "../data/ar/footer.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

const socialIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
};

export default function Footer() {
  const { t, isArabic } = useLanguage();
  const {
    logo,
    contact,
    linksTitle,
    links,
    map,
    socials,
    copyright,
    designer,
  } = useLocalizedData(footerData, arabicFooterData);

  return (
    <footer className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr_1.35fr] lg:gap-16">
          {/* Brand and Contact */}
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-auto w-52.5 object-contain"
              />
            </Link>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main-100/10 text-main-100">
                  <MapPin size={20} strokeWidth={2.4} />
                </div>

                <span className="text-sm font-medium">{contact.address}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main-100/10 text-main-100">
                  <Phone size={20} strokeWidth={2.4} />
                </div>

                <a
                  dir="ltr"
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                  className="phone-number text-sm font-medium transition hover:text-main-100"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main-100/10 text-main-100">
                  <Mail size={20} strokeWidth={2.4} />
                </div>

                <a
                  href={`mailto:${contact.email}`}
                  className="break-all text-sm font-medium transition hover:text-main-100"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              {socials.map((social) => {
                const Icon =
                  socialIconMap[social.icon as keyof typeof socialIconMap];

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-main-100 hover:bg-main-100 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-950">
              {linksTitle}
            </h3>

            <div className="mt-7 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-3 text-sm font-semibold text-gray-700 transition hover:text-main-100"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-main-100/10 text-main-100 transition group-hover:bg-main-100 group-hover:text-white">
                    <ChevronRight
                      size={16}
                      strokeWidth={2.6}
                      className={isArabic ? "rtl-flip" : ""}
                    />
                  </span>

                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-950">
              {map.title}
            </h3>

            <div className="mt-7 overflow-hidden rounded-3xl border border-gray-100 bg-gray-100 shadow-xl shadow-gray-200/60">
              <iframe
                src={map.src}
                className="h-70 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zarif Medical Center map location"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-gray-200 pt-7 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            ©{" "}
            <Link
              href="/"
              className="font-semibold text-main-100 hover:underline"
            >
              {copyright}
            </Link>
            {t(", All Rights Reserved.")}
          </p>

          <p>
            {designer.label}{" "}
            <Link
              href={designer.href}
              className="font-semibold text-main-100 hover:underline"
            >
              {designer.name}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
