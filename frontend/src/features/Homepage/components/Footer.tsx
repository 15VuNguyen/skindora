import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

interface FooterLinkColumnProps {
  title: string;
  links: { text: string; href: string }[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 font-semibold tracking-wider text-gray-500 uppercase">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.text}>
          <Link to={link.href} className="text-slate-800 transition-colors hover:text-blue-600">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const productLinks = [
    { text: "Bestsellers", href: "/products?sort=bestsellers" },
    { text: "Skincare", href: "/products?category=skincare" },
    { text: "Bodycare", href: "/products?category=bodycare" },
    { text: "About", href: "/about" },
  ];

  const infoLinks = [
    { text: "Contacts", href: "/contact" },
    { text: "Shipping", href: "/shipping-policy" },
    { text: "Return Policy", href: "/return-policy" },
  ];

  const socialLinks = [
    { text: "Instagram", href: "https://instagram.com" },
    { text: "Facebook", href: "https://facebook.com" },
  ];

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Subscribed with email:", e.currentTarget.email.value);
  };

  return (
    <footer className="bg-[#F0F8FF] text-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-6 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-3">
            <img src={logo} alt="Skindora" className="h-8 w-auto" />
          </div>

          <div className="md:col-span-4 lg:col-span-5">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <FooterLinkColumn title="Products" links={productLinks} />
              <FooterLinkColumn title="Information" links={infoLinks} />
              <FooterLinkColumn title="Social" links={socialLinks} />
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4 lg:ml-auto">
            <h3 className="text-lg font-semibold text-blue-600">Unlock Your Welcome Offer</h3>
            <p className="mt-1 mb-4 text-gray-600">Sign up for email and save 10% on your first buy</p>
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="h-12 w-full rounded-full border border-blue-300 bg-white px-6 pr-14 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-200">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 py-6 text-gray-500 sm:flex-row">
          <p className="mb-4 sm:mb-0">© 2025 SKINDORA ALL RIGHTS RESERVED</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-blue-600">
              PRIVACY POLICY
            </Link>
            <Link to="/terms-of-service" className="hover:text-blue-600">
              TERMS OF SERVICE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
