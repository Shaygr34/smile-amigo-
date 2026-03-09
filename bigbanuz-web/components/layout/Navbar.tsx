"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/utils/constants";
import { buildWhatsAppUrlSimple } from "@/lib/utils/whatsapp";
import { analytics } from "@/lib/utils/analytics";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface NavbarProps {
  logoUrl?: string;
}

// Pages with full-viewport dark hero images where nav starts transparent with white text
const DARK_HERO_PAGES = ["/", "/events", "/surf", "/about"];

export default function Navbar({ logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const hasDarkHero = DARK_HERO_PAGES.includes(pathname);
  const [scrolled, setScrolled] = useState(!hasDarkHero);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hasDarkHero) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasDarkHero]);

  const handleWhatsAppClick = () => {
    analytics.whatsappClick("nav");
  };

  return (
    <>
      <nav
        dir="ltr"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--color-white-pure)]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-black/[0.04]"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label={t("mainNav")}
      >
        <div className="max-w-wide mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[4.5rem] lg:h-[5rem]">
            {/* Logo — brand mark, not a label */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Smile Amigo"
                  width={36}
                  height={36}
                  className="rounded-full"
                  priority
                />
              ) : null}
              <span className={`font-heading text-[1.35rem] lg:text-[1.5rem] font-bold tracking-[-0.03em] transition-colors duration-500 ${
                scrolled ? "text-black" : "text-white"
              }`}>
                Smile Amigo
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10 lg:gap-12">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
                    scrolled ? "text-black/70 hover:text-black" : "text-white/80 hover:text-white"
                  }`}
                >
                  {t(link.labelKey)}
                  {/* Animated underline */}
                  <span className={`absolute -bottom-1 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300 ease-out ${
                    scrolled ? "bg-black" : "bg-white"
                  }`} />
                </Link>
              ))}

              {/* Utilities cluster */}
              <div className="flex items-center gap-2 ml-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* CTA */}
              <a
                href={buildWhatsAppUrlSimple()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center px-5 py-2 bg-sun-gradient text-white text-[0.8rem] font-semibold uppercase tracking-[0.08em] rounded-full shadow-sun-glow hover:shadow-sun-glow-lg hover:-translate-y-[1px] active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sun/40 focus:ring-offset-2"
              >
                {t("getInTouch")}
              </a>
            </div>

            {/* Mobile: Language + Theme Toggle + Hamburger */}
            <div className="flex items-center gap-1.5 md:hidden">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                type="button"
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                onClick={() => setMobileOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={mobileOpen}
              >
                {/* Refined hamburger — thinner lines, more space */}
                <svg
                  className={`w-6 h-6 transition-colors duration-300 ${
                    scrolled ? "text-black" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 7h16M4 12h12M4 17h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
