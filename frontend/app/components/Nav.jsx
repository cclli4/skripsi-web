"use client";

import { useState } from "react";

const navItems = [
  { href: "#home", label: "Utama" },
  { href: "#informasi", label: "Informasi" },
  { href: "#panduan", label: "Panduan" },
  { href: "#diagnosis", label: "Input Gejala" },
  { href: "#hasil", label: "Hasil" },
  { href: "#riwayat", label: "Riwayat" },
];

export default function Nav() {
  const [user, setUser] = useState(null);

  const handleAuthClick = () => {
    if (user) {
      setUser(null);
    } else {
      setUser({ name: "Cici Dewi" });
    }
  };

  const avatarInitial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

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
            <button
              type="button"
              className="primary-nav__profile"
              onClick={handleAuthClick}
              title="Klik untuk simulasi logout"
            >
              <span className="primary-nav__avatar">{avatarInitial}</span>
              <span className="primary-nav__name">{user.name}</span>
            </button>
          ) : (
            <button
              type="button"
              className="primary-nav__login"
              onClick={handleAuthClick}
              title="Klik untuk simulasi login"
            >
              Log Me In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
