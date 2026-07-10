import { ArrowRight, HeartPulse, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import aboutIntroData from "../data/aboutIntro.json";

export default function AboutIntro() {
  const { eyebrow, title, paragraphs, image, signature, button } =
    aboutIntroData;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Soft Background */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Image Side */}
        <div className="relative">
          <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-3xl bg-main-100/10 sm:block" />
          <div className="absolute -bottom-4 -right-4 hidden h-28 w-28 rounded-3xl bg-main-100/15 sm:block" />

          <div className="relative overflow-hidden rounded-4xl bg-gray-100 shadow-2xl shadow-gray-200/70">
            <Image
              src={image.src}
              alt={image.alt}
              width={900}
              height={650}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-82.5 w-full object-cover sm:h-107.5 lg:h-125"
            />

            <div className="absolute inset-0 bg-linear-to-tr from-gray-950/20 via-transparent to-main-100/10" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-md sm:left-6 sm:right-auto sm:w-77.5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-main-100 text-white">
                  <HeartPulse size={22} strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Compassionate Care
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    Serving families since 1954
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Side */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
            <Quote size={15} strokeWidth={2.5} />
            {eyebrow}
          </div>

          <h2 className="max-w-xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
            {title}
          </h2>

          <div className="mt-6 space-y-5 text-base font-medium leading-8 text-gray-600">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-9 border-t border-gray-200 pt-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100 ring-4 ring-main-100/10">
                  <Image
                    src={signature.image}
                    alt={signature.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-950">
                    {signature.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-main-100">
                    {signature.role}
                  </p>
                </div>
              </div>

              <Link
                href={button.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-main-100 px-6 py-3 text-sm font-bold uppercase tracking-wide text-main-100 transition hover:bg-main-100 hover:text-white"
              >
                {button.text}
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
