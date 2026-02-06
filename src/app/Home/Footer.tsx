import React from "react";

type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/reach1k/",
    icon: "M12.017 5.986c-1.711 0-1.926.007-2.6.038-.674..."
  },
  {
    name: "Twitter",
    href: "https://twitter.com/reach1k",
    icon: "M23.953 4.57a10 10 0 01-2.825.775..."
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/reach1k",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12..."
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/reach1k",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328..."
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              About Reach1k<span className="text-blue-400">.</span>
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8">
              Reach1k is your go-to platform for real-time social media analytics, AI-powered insights, 
              and audience trends. Helping creators, businesses, and marketers make smarter decisions 
              and grow their engagement effortlessly.
            </p>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect with us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <p className="text-gray-300 mb-2">📍 Bhopal, India</p>
            <p className="text-gray-300 mb-2">📧 support@reach1k.com</p>
            <p className="text-gray-300">📞 +91 98765 43210</p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Useful Links</h4>
            <ul className="text-gray-300 space-y-2">
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/features" className="hover:text-blue-400">Features</a></li>
              <li><a href="/pricing" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="/blog" className="hover:text-blue-400">Blog</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
            <p className="text-gray-300 mb-4">
              Get the latest updates and tips from Reach1k directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-md text-gray-900 flex-1"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Reach1k. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
