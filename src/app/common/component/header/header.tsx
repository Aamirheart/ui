"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/svg/HIO.svg"
            alt="Heart It Out"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          
          <NavLink label="HOME" active />

          {/* SERVICES DROPDOWN */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-teal-600">
              SERVICES
              <span className="text-xs">▾</span>
            </button>

            {/* DROPDOWN */}
            <div
              className="
                invisible opacity-0
                group-hover:visible group-hover:opacity-100
                absolute left-0 top-full pt-2
                w-64 rounded-lg bg-white
                shadow-lg border border-slate-200
                transition-all duration-200
              "
            >
              <div className="rounded-lg overflow-hidden">
                <DropdownItem label="Individual Therapy" />
                <DropdownItem label="Couples Therapy" />
                <DropdownItem label="Family Therapy" />
                <DropdownItem label="Child Therapy" />
                <DropdownItem label="Supervision" />
                <DropdownItem label="Psychiatrist" />
                <DropdownItem label="Career Counselling" />
                <DropdownItem label="Diagnostics" />
              </div>
            </div>
          </div>

          <NavLink label="ACADEMY" />
          <NavLink label="STORE" />
          <NavLink label="EVENTS" />
          <NavLink label="CORPORATE" />
        </nav>

        {/* LOGIN BUTTON */}
        <div className="hidden md:block">
          <button className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800">
            <span className="grid h-5 w-5 place-items-center rounded-full border border-white">
              👤
            </span>
            LOGIN
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function NavLink({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
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

function DropdownItem({ label }: { label: string }) {
  return (
    <Link
      href="#"
      className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600 border-b last:border-b-0"
    >
      {label}
    </Link>
  );
}
