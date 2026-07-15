"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Ear,
  Eye,
  Hand,
  HeartPulse,
  Mars,
  Stethoscope,
  Utensils,
  Venus,
} from "lucide-react";

import servicesData from "../data/services.json";
import arabicServicesData from "../data/ar/services.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

const iconMap = {
  stethoscope: Stethoscope,
  ear: Ear,
  hand: Hand,
  heartPulse: HeartPulse,
  venus: Venus,
  bone: Bone,
  activity: Activity,
  mars: Mars,
  baby: Baby,
  eye: Eye,
  brain: Brain,
  utensils: Utensils,
};

export default function ServicesSection() {
  const { t, isArabic } = useLanguage();
  const { eyebrow, title, services } = useLocalizedData(
    servicesData,
    arabicServicesData,
  );

  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-main-100">
            {eyebrow}
          </p>

          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            {title}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];

            return (
              <Link
                key={service.name}
                href={service.href}
                className="group block transition duration-300 hover:-translate-y-1"
              >
                <article className="relative min-h-75 overflow-hidden rounded-3xl bg-gray-900 p-6 shadow-sm transition duration-300 group-hover:shadow-2xl group-hover:shadow-main-100/20">
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="rounded-[inherit] object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 rounded-[inherit] bg-gray-950/55 transition duration-300 group-hover:bg-gray-950/25" />
                  <div className="absolute inset-0 rounded-[inherit] bg-main-100/20 mix-blend-multiply" />
                  <div className="absolute inset-0 rounded-[inherit] bg-linear-to-t from-gray-950 via-gray-950/50 to-transparent" />

                  <div className="relative z-10 flex h-full min-h-63 flex-col justify-between">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg backdrop-blur-md transition group-hover:bg-main-100">
                        {Icon && <Icon size={27} strokeWidth={2.3} />}
                      </div>

                      <h3 className="mt-6 text-2xl font-bold text-white">
                        {service.name}
                      </h3>

                      <p className="mt-3 text-sm font-medium leading-6 text-white/80">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                      {t("Learn More")}
                      <ArrowRight
                        size={17}
                        strokeWidth={2.5}
                        className={`transition group-hover:translate-x-1 ${
                          isArabic ? "rtl-flip" : ""
                        }`}
                      />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
