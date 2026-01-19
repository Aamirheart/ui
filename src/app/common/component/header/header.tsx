"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

          {/* LEFT - HAMBURGER (mobile) */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center md:justify-start justify-end flex-1 md:flex-none">
            <Image
              src="/svg/HIO.svg"
              alt="Heart It Out"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* RIGHT SPACE FOR BALANCE (mobile) */}
          {/* <div className="w-8 md:hidden" /> */}

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-6 items-center">
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
              <NavLink label="HOME" active />
              <NavLink label="SERVICES" />
              <NavLink label="ACADEMY" />
              <NavLink label="STORE" />
              <NavLink label="EVENTS" />
              <NavLink label="CORPORATE" />
            </nav>

            <button className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800">
              👤 LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {/* MOBILE MENU OVERLAY */}
<div
  className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
    open ? "visible bg-black/40 backdrop-blur-[1px]" : "invisible bg-black/0"
  }`}
>
  <div
    className={`bg-white rounded-xl w-[85%] max-w-sm p-6 relative shadow-xl
    transition-all duration-300 ease-out
    ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
  `}
  >
    {/* Close */}
    <button
      onClick={() => setOpen(false)}
      className="absolute top-3 right-4 text-xl hover:scale-110 transition"
    >
      ✕
    </button>

    {/* Menu */}
    <div className="flex flex-col gap-4 text-center text-slate-600 font-medium">
      <MobileLink label="HOME" />
      <MobileLink label="SERVICES" />
      <MobileLink label="ACADEMY" />
      <MobileLink label="STORE" />
      <MobileLink label="CORPORATE" />

      <button className="mt-4 bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 active:scale-95 transition">
        👤 LOGIN
      </button>
    </div>
  </div>
</div>

    </>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function NavLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <Link
      href="#"
      className={`relative pb-1 ${
        active
          ? "text-teal-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-teal-600"
          : "hover:text-teal-600"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ label }: { label: string }) {
  return (
    <Link
      href="#"
      className="py-2 hover:text-teal-600"
    >
      {label}
    </Link>
  );
}
