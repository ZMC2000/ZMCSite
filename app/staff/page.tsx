"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  FlaskConical,
  Filter,
  HeartPulse,
  Phone,
  Pill,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

import staffPageData from "../data/staffPage.json";
import arabicStaffPageData from "../data/ar/staffPage.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

const categoryIconMap = {
  Nursing: Stethoscope,
  Physiotherapy: Activity,
  Laboratory: FlaskConical,
  Pharmacy: Pill,
};

export default function StaffPage() {
  const { t } = useLanguage();
  const { hero, intro, staff, cta } = useLocalizedData(
    staffPageData,
    arabicStaffPageData,
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(staffPageData.staff.map((member) => member.category)),
      ),
    ];
  }, []);

  const filteredStaff =
    selectedCategory === "All"
      ? staff
      : staff.filter(
          (_, index) =>
            staffPageData.staff[index].category === selectedCategory,
        );

  function getCategoryLabel(category: string) {
    const memberIndex = staffPageData.staff.findIndex(
      (member) => member.category === category,
    );
    return memberIndex >= 0 ? staff[memberIndex].category : category;
  }

  return (
    <main>
      <section className="relative min-h-90 overflow-hidden bg-gray-900 sm:min-h-107.5 lg:min-h-125">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gray-950/50" />
        <div className="absolute inset-0 bg-main-100/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-r from-gray-950/80 via-gray-950/40 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-90 max-w-7xl items-center px-5 py-20 sm:min-h-107.5 lg:min-h-125">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <UsersRound size={15} strokeWidth={2.5} />
              {hero.eyebrow}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/85 sm:text-xl">
              {hero.subtitle}
            </p>

            <div className="mt-7 h-1 w-24 rounded-full bg-main-100" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-10 sm:py-12">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="rounded-4xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                  <Filter size={15} strokeWidth={2.5} />
                  {t("Filter Staff")}
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                  {intro.title}
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-gray-600 sm:text-base">
                  {intro.description}
                </p>
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-15 w-full appearance-none rounded-full border border-gray-100 bg-gray-50 px-6 pr-14 text-base font-bold text-gray-950 shadow-sm outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All"
                        ? t("All Staff")
                        : getCategoryLabel(category)}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={22}
                  strokeWidth={2.5}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-main-100"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-sm font-bold text-main-100">
                <UsersRound size={17} strokeWidth={2.5} />
                {selectedCategory === "All"
                  ? t("All Staff")
                  : getCategoryLabel(selectedCategory)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                <UserRound size={17} strokeWidth={2.5} />
                {filteredStaff.length}{" "}
                {t(filteredStaff.length > 1 ? "Members" : "Member")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white pb-16 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredStaff.map((member) => {
              const originalMember = staffPageData.staff.find(
                (entry) => entry.image === member.image,
              );
              const categoryKey = originalMember?.category as
                | keyof typeof categoryIconMap
                | undefined;
              const CategoryIcon = categoryKey
                ? categoryIconMap[categoryKey]
                : HeartPulse;

              return (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-main-100/15"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-gray-950/10 to-transparent" />

                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-main-100 shadow-sm backdrop-blur">
                      <CategoryIcon size={14} strokeWidth={2.5} />
                      {member.category}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-2xl font-extrabold tracking-tight text-white">
                        {member.name}
                      </h3>

                      <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white/80">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="overflow-hidden rounded-4xl bg-gray-950 shadow-2xl shadow-gray-300/60">
            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Phone size={15} strokeWidth={2.5} />
                    {t("Staff Assistance")}
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {cta.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/75">
                    {cta.description}
                  </p>

                  <p
                    dir="ltr"
                    className="phone-number mt-5 text-2xl font-extrabold text-white"
                  >
                    {cta.phone}
                  </p>
                </div>

                <Link
                  href={cta.buttonHref}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-main-100 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90"
                >
                  {cta.buttonText}
                  <Phone size={17} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
