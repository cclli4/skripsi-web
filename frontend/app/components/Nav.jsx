"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { parseJwt } from "@/lib/auth";

const navItems = [
  { href: "#home", label: "Utama" },
  { href: "#informasi", label: "Informasi" },
  { href: "#panduan", label: "Panduan" },
  { href: "#diagnosis", label: "Input Gejala" },
  { href: "#hasil", label: "Hasil" },
  { href: "#riwayat", label: "Riwayat" },
];

function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const profileStr = localStorage.getItem("user_profile");
    if (profileStr) return JSON.parse(profileStr);
    const token = localStorage.getItem("auth_token");
    if (token) {
      const payload = parseJwt(token);
      return { email: payload?.email, role: payload?.role, full_name: payload?.full_name };
    }
  } catch (e) {
    console.warn("Gagal memuat user dari storage", e);
  }
  return null;
}

export default function Nav() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const isAdmin = user?.role === "admin";
  const isExpert = user?.role === "expert";

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_profile");
    }
    setUser(null);
    setMenuOpen(false);
  };

  const avatarInitial = (user?.full_name || user?.email || "U").charAt(0).toUpperCase();
  const displayName = user?.full_name || user?.email || "Akun";
  const roleLabel =
    user?.role === "expert" ? "Pakar" : user?.role === "admin" ? "Admin" : user?.role ? "Pasien" : null;

  return (
    <nav className="primary-nav">
      <div className="primary-nav__inner">
        <div className="primary-nav__links">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} className="primary-nav__link">
              {label}
            </a>
          ))}
        </div>
        <div className="primary-nav__auth">
          {user ? (
            <div className="primary-nav__profile-wrap" ref={profileRef}>
              <div className="primary-nav__links primary-nav__links--compact">
                {isAdmin && (
                  <Link href="/admin" className="primary-nav__link primary-nav__link--pill">
                    Panel Admin
                  </Link>
                )}
                {isExpert && (
                  <Link href="/expert" className="primary-nav__link primary-nav__link--pill">
                    Panel Pakar
                  </Link>
                )}
              </div>
              <button
                type="button"
                className="primary-nav__profile"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              >
                <span className="primary-nav__avatar">{avatarInitial}</span>
                <span className="primary-nav__name">
                  {displayName}
                  {roleLabel && <span className="primary-nav__role">{roleLabel}</span>}
                </span>
              </button>
              {menuOpen && (
                <div className="primary-nav__menu">
                  <div className="primary-nav__menu-header">
                    <div className="primary-nav__menu-name">{displayName}</div>
                    {user?.email && <div className="primary-nav__menu-email">{user.email}</div>}
                    {roleLabel && <div className="primary-nav__menu-role">{roleLabel}</div>}
                  </div>
                  <button type="button" className="primary-nav__menu-item" onClick={handleLogout}>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="primary-nav__login">
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
