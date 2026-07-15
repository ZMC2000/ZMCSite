"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  FlaskConical,
  HeartPulse,
  Layers3,
} from "lucide-react";

import servicesPageData from "../data/servicesPage.json";
import arabicServicesPageData from "../data/ar/servicesPage.json";
import { useLanguage, useLocalizedData } from "../i18n/language-context";

export default function ServicesPage() {
  const { t, isArabic } = useLanguage();
  const { hero, floors } = useLocalizedData(
    servicesPageData,
    arabicServicesPageData,
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
        <div className="absolute inset-0 bg-linear-to-r from-gray-950/75 via-gray-950/35 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-90 max-w-7xl items-center px-5 py-20 sm:min-h-107.5 lg:min-h-125">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <HeartPulse size={15} strokeWidth={2.5} />
              {t("Our Departments")}
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

      {/* Services Overview */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
              <Building2 size={15} strokeWidth={2.5} />
              {t("Clinics and Services")}
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
              {t("Care Across Every Floor")}
            </h2>

            <p className="mt-5 text-base font-medium leading-8 text-gray-600 sm:text-lg">
              {t(
                "Discover how Zarif Medical Center organizes clinical care, diagnostics, prevention, and supportive services across dedicated floors.",
              )}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main-100 text-white">
                <HeartPulse size={28} strokeWidth={2.4} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-950">
                {t("Specialized Clinics")}
              </h3>

              <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                {t(
                  "Multiple medical specialties covering daily consultations and focused care.",
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main-100 text-white">
                <FlaskConical size={28} strokeWidth={2.4} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-950">
                {t("Diagnostics")}
              </h3>

              <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                {t(
                  "Laboratory and imaging services supporting accurate treatment decisions.",
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main-100 text-white">
                <Layers3 size={28} strokeWidth={2.4} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-950">
                {t("Organized Floors")}
              </h3>

              <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                {t(
                  "Services grouped by floor to help patients access care more easily.",
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Sections */}
      <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="space-y-20">
            {floors.map((floor, index) => (
              <div
                key={floor.title}
                className="rounded-4xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-7 lg:p-8"
              >
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-200">
                    <Image
                      src={floor.mainImage.src}
                      alt={floor.mainImage.alt}
                      width={900}
                      height={620}
                      unoptimized
                      className="h-80 w-full object-cover transition duration-500 hover:scale-105 sm:h-105"
                    />

                    <div className="absolute inset-0 bg-gray-950/25" />
                    <div className="absolute inset-0 bg-main-100/10 mix-blend-multiply" />

                    <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                        {t("Floor")}
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-950">
                        {floor.title}
                      </p>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                      <Layers3 size={15} strokeWidth={2.5} />
                      {t("Clinic Floor")}
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                      {floor.title}
                    </h2>

                    <div className="mt-5 h-px w-full bg-gray-200" />

                    <p className="mt-6 text-base font-medium leading-8 text-gray-600">
                      {floor.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-sm font-bold text-main-100">
                        <CheckCircle2 size={17} strokeWidth={2.5} />
                        {t("Patient Care")}
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-sm font-bold text-main-100">
                        <CheckCircle2 size={17} strokeWidth={2.5} />
                        {t("Specialized Services")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {floor.gallery.map((image) => (
                    <div
                      key={image.src}
                      className="group relative overflow-hidden rounded-2xl bg-gray-200"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={500}
                        height={340}
                        unoptimized
                        className="h-47.5 w-full object-cover transition duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gray-950/20 transition group-hover:bg-gray-950/10" />
                      <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-main-100 shadow backdrop-blur">
                        <Camera size={18} strokeWidth={2.4} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-4xl bg-main-100 p-7 text-white shadow-2xl shadow-main-100/20 sm:p-10 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("Need help choosing the right service?")}
              </h2>

              <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/85">
                {t(
                  "Contact Zarif Medical Center and our team will guide you to the right department or appointment.",
                )}
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-main-100 transition hover:bg-white/90 lg:mt-0"
            >
              {t("Contact Us")}
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
