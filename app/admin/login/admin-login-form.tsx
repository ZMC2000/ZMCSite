"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsLoading(false);

    if (response?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950">
      <Image
        src="/about-header.png"
        alt="Zarif Medical Center admin login"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40"
      />

      <div className="absolute inset-0 bg-gray-950/70" />
      <div className="absolute inset-0 bg-main-100/25 mix-blend-multiply" />
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-main-100/20 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-md overflow-hidden rounded-4xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo/logo.png"
              alt="Zarif Medical Center"
              width={220}
              height={80}
              priority
              className="h-auto w-44 object-contain"
            />
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-main-100 text-white shadow-lg shadow-main-100/25">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
              Admin Login
            </h1>

            <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
              Sign in to manage Zarif Medical Center website content.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-extrabold text-gray-950"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  strokeWidth={2.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-main-100"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@zarifmc.com"
                  className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-12 pr-5 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-extrabold text-gray-950"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  strokeWidth={2.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-main-100"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter admin password"
                  className="h-14 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-12 pr-5 text-sm font-semibold text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-main-100 focus:bg-white focus:ring-4 focus:ring-main-100/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-main-100 px-7 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-main-100/25 transition hover:bg-main-100/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
