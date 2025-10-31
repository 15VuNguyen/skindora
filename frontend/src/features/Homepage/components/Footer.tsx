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
