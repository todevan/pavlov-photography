"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/content-types";

interface EditorialNavbarProps {
  links: readonly NavLink[];
}

export function EditorialNavbar({ links }: EditorialNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="pp-header fixed inset-x-0 top-0 z-50">
      <div className={isScrolled || isOpen ? "pp-nav pp-nav-solid" : "pp-nav pp-nav-clear"}>
        <a href="#hero" className="pp-brand pp-display">
          Pavlov Photography
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Основна навигация">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="pp-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="pp-nav-cta hidden lg:inline-flex">
          Запази снимане
        </a>

        <button
          type="button"
          className="pp-menu-button lg:hidden"
          aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {isOpen ? (
          <nav className="pp-mobile-menu lg:hidden" aria-label="Мобилна навигация">
            {links.map((link) => (
              <a
                key={`${link.href}-mobile`}
                href={link.href}
                className="pp-mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="pp-mobile-book" onClick={() => setIsOpen(false)}>
              Запази снимане
            </a>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
