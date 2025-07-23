"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Home, LayoutPanelTop } from "lucide-react";
import { UserAvatar } from "./auth/user-avatar";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const mobileMenu = document.getElementById("mobile-menu");
      const menuButton = target.closest("[data-mobile-menu-button]");

      // If click is outside mobile menu and not on the menu button, close menu
      if (
        isMobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(target) &&
        !menuButton
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [lastScrollY, isMobileMenuOpen]);

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-100/70 to-pink-100/70 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
            {/* Left side - Tchoup Data image */}
            <div className="flex justify-start">
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/Tchoup-Data-128x128.png"
                  alt="Tchoup Data"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </button>
            </div>

            {/* Center - Navigation links (desktop only) - truly centered */}
            <div className="hidden md:flex items-center justify-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  isActive("/") ? "text-emerald-800" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  isActive("/dashboard")
                    ? "text-emerald-800"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  isActive("/about")
                    ? "text-emerald-800"
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>
            </div>

            {/* Right side - User avatar and mobile menu */}
            <div className="flex items-center justify-end space-x-3">
              {/* User Avatar - always visible on desktop */}
              <div className="hidden md:block">
                <UserAvatar />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  data-mobile-menu-button
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/Tchoup-Sundae-128x128.png"
                    alt="Menu"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden border-t border-border/40 bg-background backdrop-blur-md mb-2 rounded-md"
            >
              <div className="pt-2 pb-3 space-y-1 px-4">
                {/* Mobile user avatar */}
                <div className="flex justify-center py-2 border-b border-border/40 mb-2">
                  <UserAvatar />
                </div>
                <button
                  className={`flex items-center block w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive("/")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => handleLinkClick("/")}
                >
                  <Home className="h-4 w-4 mr-2" /> Home
                </button>
                <button
                  className={`flex items-center block w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive("/dashboard")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => handleLinkClick("/dashboard")}
                >
                  <LayoutPanelTop className="h-4 w-4 mr-2" /> Dashboard
                </button>
                <button
                  className={`flex items-center block w-full text-left px-3 py-2 text-base font-medium transition-colors rounded-md ${
                    isActive("/about")
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => handleLinkClick("/about")}
                >
                  <BookOpen className="h-4 w-4 mr-2" /> About
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
