import { ArrowRight, CalendarDays, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import headerData from "../data/header.json";

export default function Header() {
  const { title, subtitle, button, image } = headerData;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Image */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        className="object-cover object-[68%_center] sm:object-[72%_center] lg:object-center"
      />

      {/* Desktop Overlay */}
      <div className="absolute inset-0 hidden bg-linear-to-r from-white via-white/15 to-white/5 lg:block" />

      {/* Mobile Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-white via-white/1  5 to-white/5 lg:hidden" />
      <div className="absolute inset-0 bg-main-100/5" />

      {/* Decorative mobile glow */}
      <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-main-100/10 blur-3xl lg:hidden" />

      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <div className="flex min-h-130 items-center py-12 sm:min-h-140 lg:min-h-180 lg:py-20">
          <div className="max-w-[78%] sm:max-w-xl lg:max-w-2xl">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100 shadow-sm backdrop-blur lg:bg-main-100/10 lg:shadow-none">
              <HeartPulse size={15} strokeWidth={2.5} />
              Since 1954
            </div>

            <h1 className="max-w-[15ch] text-[38px] font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:max-w-2xl lg:text-6xl">
              {title}
            </h1>

            {/* <p className="mt-5 hidden max-w-xl text-base font-medium leading-7 text-gray-700 sm:block lg:text-lg lg:leading-8">
              {subtitle}
            </p> */}

            <Link
              href={button.href}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-main-100 px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90 sm:px-8 sm:py-4 sm:text-sm"
            >
              {button.text}
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent lg:hidden" />
    </section>
  );
}
