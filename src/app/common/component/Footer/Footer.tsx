"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-950 text-white pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* CONTACT Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
              Contact
            </h3>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-3">
                <MdLocationOn className="text-cyan-400 text-xl flex-shrink-0 mt-1" />
                <div className="text-sm text-slate-300">
                  <p>#42, 7th 'B' Cross</p>
                  <p>Koramangala 4th Block</p>
                  <p>Bangalore - 560034</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <MdEmail className="text-cyan-400 text-xl flex-shrink-0" />
                <a
                  href="mailto:hello@heartitout.in"
                  className="text-sm text-slate-300 hover:text-cyan-400 transition"
                >
                  hello@heartitout.in
                </a>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <MdPhone className="text-cyan-400 text-xl flex-shrink-0" />
                <a
                  href="tel:+917892551372"
                  className="text-sm text-slate-300 hover:text-cyan-400 transition"
                >
                  +91 789 255 1372
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://wa.me/917892551372"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="hidden lg:block">
            <div className="bg-slate-800 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-cyan-400 text-sm font-semibold mb-2">
                  📍 Heart It Out
                </p>
                <p className="text-xs text-slate-400">
                  Koramangala, Bangalore
                </p>
              </div>
            </div>
          </div>

          {/* OUR SERVICES Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Individual Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Couples Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Family Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Child Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Psychiatry
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Supervision
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Career Counselling
                </Link>
              </li>
            </ul>
          </div>

          {/* EXPLORE Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Therapists
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Academy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Corporate
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm italic"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-300 hover:text-cyan-400 transition text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <p className="text-xs text-slate-400 mb-2">
            <strong>Disclaimer :</strong>
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            We provide medical service and suicide prevention helpline. If you are feeling suicidal, we would suggest you
            immediately call up our suicide prevention helpline{" "}
            <strong>+91 789 255 1372</strong>. We don't provide in-patient services
            currently.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            ©{currentYear} Heart It Out Pvt. Ltd. All rights reserved.
          </p>

          {/* Payment Icons */}
          <div className="flex gap-4 items-center">
            {/* Visa */}
            <div className="bg-blue-600 px-3 py-1 rounded">
              <span className="text-white font-bold text-sm">VISA</span>
            </div>
            {/* Amex */}
            <div className="bg-blue-900 px-3 py-1 rounded">
              <span className="text-white font-bold text-xs">AMEX</span>
            </div>
            {/* Mastercard */}
            <div className="bg-red-500 px-3 py-1 rounded">
              <span className="text-white font-bold text-xs">●●</span>
            </div>
            {/* PayPal */}
            <div className="bg-blue-600 px-3 py-1 rounded">
              <span className="text-white font-bold text-xs">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
