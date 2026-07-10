"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Stethoscope,
} from "lucide-react";

import contactPageData from "../data/contactPage.json";

const iconMap = {
  phone: Phone,
  mail: Mail,
};

export default function ContactPage() {
  const { hero, intro, contactCards, extensions, location, form } =
    contactPageData;

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
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
              <Phone size={15} strokeWidth={2.5} />
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

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-main-100/5" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />
        <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-main-100/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                <MessageSquareText size={15} strokeWidth={2.5} />
                {intro.eyebrow}
              </div>

              <h2 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">
                {intro.title}
              </h2>

              <p className="mt-5 text-base font-medium leading-8 text-gray-600 sm:text-lg">
                {intro.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {contactCards.map((card) => {
                  const Icon = iconMap[card.icon as keyof typeof iconMap];

                  return (
                    <Link
                      key={`${card.title}-${card.value}`}
                      href={card.href}
                      className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-main-100/15"
                    >
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-main-100 text-white shadow-lg shadow-main-100/20 transition group-hover:scale-105">
                        {Icon && <Icon size={23} strokeWidth={2.5} />}
                      </div>

                      <h3 className="mt-5 text-lg font-extrabold text-gray-950">
                        {card.title}
                      </h3>

                      <p className="mt-2 wrap-break-word text-sm font-bold text-main-100">
                        {card.value}
                      </p>

                      <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                        {card.description}
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">
                <div className="relative border-b border-gray-100 bg-gray-50 p-6">
                  <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-main-100/10 blur-3xl" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-main-100 text-white shadow-lg shadow-main-100/20">
                      <ClipboardList size={26} strokeWidth={2.5} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                        Extensions
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold text-gray-950">
                        Phone Numbers and Extensions
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                        Use extension 8016 for clinic appointments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:p-6">
                  {extensions.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100"
                    >
                      <span className="text-sm font-bold text-gray-800">
                        {item.label}
                      </span>

                      <span className="rounded-full bg-main-100/10 px-3 py-1 text-sm font-extrabold text-main-100">
                        {item.extension}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-4xl border border-gray-100 bg-gray-950 shadow-2xl shadow-gray-300/60">
                <div className="relative p-6 sm:p-7">
                  <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-main-100/25 blur-3xl" />

                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                      <MapPin size={15} strokeWidth={2.5} />
                      Location
                    </div>

                    <h3 className="text-2xl font-extrabold text-white">
                      {location.title}
                    </h3>

                    <p className="mt-3 text-base font-bold text-white/90">
                      {location.address}
                    </p>

                    <p className="mt-3 text-sm font-medium leading-7 text-white/70">
                      {location.description}
                    </p>

                    <Link
                      href={location.mapHref}
                      target="_blank"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-main-100 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90"
                    >
                      Open Map
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-7 lg:sticky lg:top-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-main-100/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-main-100">
                <Send size={15} strokeWidth={2.5} />
                {form.eyebrow}
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                {form.title}
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-gray-600 sm:text-base">
                {form.description}
              </p>

              {submitted ? (
                <div className="mt-6 flex items-start gap-3 rounded-3xl bg-main-100/10 p-4 text-main-100">
                  <CheckCircle2
                    size={22}
                    strokeWidth={2.5}
                    className="shrink-0"
                  />
                  <div>
                    <p className="font-extrabold">Message prepared</p>
                    <p className="mt-1 text-sm font-medium leading-6">
                      This demo form is ready visually. Connect it to your email
                      service or backend later.
                    </p>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-extrabold text-gray-950"
                  >
                    {form.nameLabel}
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-extrabold text-gray-950"
                  >
                    {form.emailLabel}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-extrabold text-gray-950"
                  >
                    {form.messageLabel}
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="Write your message here"
                    className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-main-100 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90"
                >
                  {form.buttonText}
                  <Send size={17} strokeWidth={2.5} />
                </button>
              </form>

              <div className="mt-6 rounded-3xl bg-gray-50 p-5 ring-1 ring-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-main-100 text-white">
                    <Stethoscope size={21} strokeWidth={2.5} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-gray-950">
                      For urgent appointment confirmation
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-gray-600">
                      Please call the center directly instead of waiting for a
                      form response.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">
            <div className="relative h-80 bg-gray-100 sm:h-96">
              <iframe
                title="Zarif Medical Center location map"
                src="https://www.google.com/maps?q=Zarif%20Medical%20Center%20Beirut&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gray-100" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
