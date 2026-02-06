'use client';

import React from 'react';
import AnimatedChart from './AnimatedChart';

type ValueBullet = {
  icon: string;
  color: string;
  text: string;
};

const valueBullets: ValueBullet[] = [
  { icon: '📊', color: 'blue', text: 'Track engagement live' },
  { icon: '🤖', color: 'purple', text: 'AI-powered insights' },
  { icon: '🌍', color: 'green', text: 'Know your audience' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse-slow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-8 items-center lg:grid-cols-12">
          {/* Left Content */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-blue-800 animate-fade-up">
              ✨ Social Media Analytics
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 animate-fade-up animation-delay-200">
              Grow Smarter. Faster.
            </h1>

            <p className="text-gray-700 sm:text-lg animate-fade-up animation-delay-300">
              Real-time analytics, AI insights, and audience trends all in one dashboard.
            </p>

            {/* Value Bullets */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-400">
              {valueBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-${bullet.color}-100`}
                  >
                    <span className={`text-${bullet.color}-600`}>{bullet.icon}</span>
                  </div>
                  <span className="text-gray-700 text-sm">{bullet.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-up animation-delay-500">
              <a
                href="/auth/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition"
              >
                🚀 Get Started
              </a>
              <a
                href="/auth/login"
                className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                👤 Sign In
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600 animate-fade-up animation-delay-600">
              <span>Trusted by 10k+ creators</span>
              <span>⭐ 4.9/5</span>
            </div>
          </div>

          {/* Right Chart */}
          <div className="lg:col-span-7 animate-fade-right animation-delay-300">
            <AnimatedChart />
          </div>
        </div>
      </div>
    </section>
  );
}
