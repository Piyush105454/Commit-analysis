"use client";

import React from "react";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps){
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Sidebar Menu */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6">
          <ul className="space-y-4">
            {[
              { label: "Home", href: "#home-section" },
              { label: "Features", href: "#features-section" },
              { label: "About", href: "#about-section" },
              { label: "Contact", href: "#contact-section" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="mt-8 space-y-3">
            <a
              href="/auth/login"
              className="block w-full text-center py-3 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign in
            </a>
            <a
              href="/auth/register"
              className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
