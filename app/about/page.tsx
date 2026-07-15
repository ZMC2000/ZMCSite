"use client";

import {
  ArrowRight,
  Building2,
  CirclePlay,
  HeartHandshake,
  History,
  UserRound
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import aboutPageData from "../data/aboutPage.json";
import arabicAboutPageData from "../data/ar/aboutPage.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

export default function AboutPage() {
  const { t, isArabic } = useLanguage();
  const { hero, intro, history } = useLocalizedData(
    aboutPageData,
    arabicAboutPageData,
  );

  return (
    <main>
      {/* Page Hero */}
      <section className="relative min-h-90 overflow-hidden bg-gray-900 sm:min-h-107.5 lg:min-h-125">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gray-950/45" />
        <div className="absolute inset-0 bg-main-100/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-r from-gray-950/75 via-gray-950/40 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-90 max-w-7xl items-center px-5 py-20 sm:min-h-107.5 lg:min-h-125">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <UserRound size={15} strokeWidth={2.5} />
              {hero.eyebrow}
            </div>

            <p className="text-3xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </p>

            <h1 className="mt-4 text-2xl font-bold text-white sm:text-4xl">
              {hero.subtitle}
            </h1>

            <div className="mt-7 h-1 w-24 rounded-full bg-main-100" />
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Video Card */}
          <Link
            href={intro.video.url}
            target="_blank"
            className="group relative overflow-hidden rounded-4xl bg-gray-900 shadow-2xl shadow-gray-200/70"
          >
            <Image
              src={intro.video.thumbnail}
              alt={intro.video.title}
              width={900}
              height={560}
              unoptimized
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-105"
            />

            <div className="absolute inset-0 bg-gray-950/35" />
            <div className="absolute inset-0 bg-linear-to-t from-gray-950/75 via-transparent to-gray-950/20" />

            <div className="absolute left-5 top-5 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
              <p className="text-sm font-bold text-gray-950">
                {intro.video.title}
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                {t("Watch our story")}
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-main-100 text-white shadow-2xl shadow-main-100/30 transition group-hover:scale-110">
                <CirclePlay size={42} strokeWidth={2.2} />
              </div>
            </div>
          </Link>

          {/* Text */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
              <Building2 size={15} strokeWidth={2.5} />
              {intro.eyebrow}
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              {intro.title}
            </h2>

            <div className="mt-6 h-px w-full bg-gray-200" />

            <p className="mt-6 text-base font-medium leading-8 text-gray-600">
              {intro.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full bg-main-100/10 px-5 py-3 text-sm font-bold text-main-100">
                {t("MOPH Approved")}
              </div>

              <div className="rounded-full bg-main-100/10 px-5 py-3 text-sm font-bold text-main-100">
                {t("Since 1954")}
              </div>

              <div className="rounded-full bg-main-100/10 px-5 py-3 text-sm font-bold text-main-100">
                {t("Community Healthcare")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          {/* History Intro */}
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                <History size={15} strokeWidth={2.5} />
                {history.eyebrow}
              </div>

              <h2 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
                {history.title}
              </h2>

              <div className="mt-6 h-px w-full bg-gray-200" />

              <div className="mt-7 space-y-5 text-base font-medium leading-8 text-gray-600">
                {history.paragraphsTop.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="rounded-4xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/60">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-main-100">
                {t("Established")}
              </p>

              <p className="mt-3 text-6xl font-extrabold tracking-tight text-gray-950">
                1954
              </p>

              <p className="mt-4 text-sm font-medium leading-7 text-gray-600">
                {t(
                  "A community healthcare legacy built by Beiruti families to support those in need.",
                )}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-main-100/10 p-4">
                  <p className="text-2xl font-extrabold text-main-100">70+</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                    {t("Years")}
                  </p>
                </div>

                <div className="rounded-2xl bg-main-100/10 p-4">
                  <p className="text-2xl font-extrabold text-main-100">
                    {t("Beirut")}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                    {t("Community")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historic Images */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {history.images.map((image) => (
              <div
                key={image.src}
                className="group relative overflow-hidden rounded-3xl bg-gray-200 shadow-sm"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={420}
                  unoptimized
                  className="h-57.5 w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-main-100/10 mix-blend-multiply" />
              </div>
            ))}
          </div>

          {/* Bottom History Text */}
          <div className="mt-12 rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8 lg:p-10">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main-100 text-white">
                <HeartHandshake size={28} strokeWidth={2.4} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-950">
                  {t("A Legacy of Giving")}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {t("Built by generosity, continued through care")}
                </p>
              </div>
            </div>

            <div className="space-y-5 text-base font-medium leading-8 text-gray-600">
              {history.paragraphsBottom.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-main-100 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/20 transition hover:bg-main-100/90"
            >
              {t("Visit the Center")}
              <ArrowRight
                size={17}
                strokeWidth={2.5}
                className={isArabic ? "rtl-flip" : ""}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
