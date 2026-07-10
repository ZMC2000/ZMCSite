import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Syringe } from "lucide-react";

import supportServicesData from "../data/supportServices.json";

export default function SupportServices() {
  const { eyebrow, title, description, image, button, items } =
    supportServicesData;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Text */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
            <FlaskConical size={15} strokeWidth={2.5} />
            {eyebrow}
          </div>

          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            {title}
          </h2>

          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-gray-600">
            {description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700"
              >
                <CheckCircle2
                  size={18}
                  strokeWidth={2.5}
                  className="shrink-0 text-main-100"
                />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-7">
            <Link
              href={button.href}
              className="inline-flex items-center gap-2 rounded-full bg-main-100 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/20 transition hover:bg-main-100/90"
            >
              {button.text}
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -left-5 -top-5 hidden h-28 w-28 rounded-3xl bg-main-100/10 sm:block" />
          <div className="absolute -bottom-5 -right-5 hidden h-32 w-32 rounded-3xl bg-main-100/15 sm:block" />

          <div className="relative overflow-hidden rounded-4xl bg-gray-100 shadow-2xl shadow-gray-200/70">
            <Image
              src={image.src}
              alt={image.alt}
              width={900}
              height={620}
              className="h-82.5 w-full object-cover sm:h-107.5 lg:h-125"
            />

            <div className="absolute inset-0 bg-linear-to-tr from-gray-950/25 via-transparent to-main-100/10" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md sm:left-6 sm:right-auto sm:w-82.5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-main-100 text-white">
                  <Syringe size={22} strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Accessible Support
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Diagnostics, prevention, and recovery care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
