"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Ear,
  Eye,
  Filter,
  Hand,
  HeartPulse,
  Mars,
  Phone,
  Smile,
  Stethoscope,
  Utensils,
  Venus,
} from "lucide-react";

import schedulePageData from "../data/schedulePage.json";

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
  smile: Smile,
};

export default function SchedulePage() {
  const { hero, categories, cta } = schedulePageData;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((category) => category.name === selectedCategory);

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
              <CalendarDays size={15} strokeWidth={2.5} />
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
                  Filter Schedule
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                  Choose a Medical Category
                </h2>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-gray-600 sm:text-base">
                  Select a category to show only its doctors and available visit
                  times, or choose All to view the complete schedule.
                </p>
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-15 w-full appearance-none rounded-full border border-gray-100 bg-gray-50 px-6 pr-14 text-base font-bold text-gray-950 shadow-sm outline-none transition focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                >
                  <option value="All">All Categories</option>

                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
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
                <CalendarDays size={17} strokeWidth={2.5} />
                {selectedCategory === "All"
                  ? `${categories.length} Categories`
                  : selectedCategory}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                <HeartPulse size={17} strokeWidth={2.5} />
                {filteredCategories.reduce(
                  (total, category) => total + category.doctors.length,
                  0,
                )}{" "}
                Specialist
                {filteredCategories.reduce(
                  (total, category) => total + category.doctors.length,
                  0,
                ) > 1
                  ? "s"
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white pb-16 sm:pb-20 lg:pb-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
        <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="space-y-10">
            {filteredCategories.map((category) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap];

              return (
                <section
                  key={category.name}
                  className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60"
                >
                  <div className="relative border-b border-gray-100 bg-gray-50 p-6 sm:p-8">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-main-100/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-main-100 text-white shadow-lg shadow-main-100/20">
                          {Icon && <Icon size={29} strokeWidth={2.4} />}
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                            Medical Category
                          </p>

                          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                            {category.name}
                          </h2>

                          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-600 sm:text-base sm:leading-7">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-sm font-bold text-main-100">
                        <CalendarDays size={17} strokeWidth={2.5} />
                        {category.doctors.length} Specialist
                        {category.doctors.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2 lg:p-8">
                    {category.doctors.map((doctor) => (
                      <article
                        key={doctor.name}
                        className="group overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60"
                      >
                        <div className="grid min-h-full sm:grid-cols-[150px_1fr]">
                          <div className="relative min-h-64 overflow-hidden bg-gray-100 sm:min-h-full">
                            <Image
                              src={doctor.image}
                              alt={doctor.name}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 100vw, 150px"
                              className="object-cover object-top transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-gray-950/30 via-transparent to-transparent sm:hidden" />
                          </div>

                          <div className="flex flex-col justify-between p-5 sm:p-6">
                            <div>
                              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-main-100 shadow-sm ring-1 ring-gray-100">
                                <HeartPulse size={14} strokeWidth={2.5} />
                                Specialist
                              </div>

                              <h3 className="text-2xl font-extrabold tracking-tight text-gray-950">
                                {doctor.name}
                              </h3>

                              <div className="mt-5 space-y-3">
                                {doctor.times.map((time) => (
                                  <div
                                    key={time}
                                    className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-gray-700 shadow-sm ring-1 ring-gray-100"
                                  >
                                    <Clock3
                                      size={18}
                                      strokeWidth={2.5}
                                      className="mt-0.5 shrink-0 text-main-100"
                                    />
                                    <span>{time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {doctor.note ? (
                              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-main-100">
                                <CheckCircle2 size={15} strokeWidth={2.5} />
                                {doctor.note}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="overflow-hidden rounded-4xl bg-gray-950 shadow-2xl shadow-gray-300/60">
            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-main-100/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Phone size={15} strokeWidth={2.5} />
                    Appointment Confirmation
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {cta.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/75">
                    {cta.description}
                  </p>

                  <p className="mt-5 text-2xl font-extrabold text-white">
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
