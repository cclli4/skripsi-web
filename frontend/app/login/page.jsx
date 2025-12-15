"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api";
import { parseJwt } from "@/lib/auth";

const benefits = [
  {
    title: "Ringkasan Personal",
    description: "Lihat status risiko dan rekomendasi lanjutan berdasarkan riwayat diagnosis Anda.",
  },
  {
    title: "Riwayat Aman",
    description: "Catatan tersimpan rapih sehingga tenaga medis mudah mengevaluasi perubahan kondisi.",
  },
  {
    title: "Notifikasi Lanjutan",
    description: "Dapatkan pemberitahuan saat waktunya melakukan diagnosis ulang atau kontrol klinis.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return !formValues.email || !formValues.password;
  }, [formValues]);

  const handleChange = (field) => (event) => {
    const value = field === "rememberMe" ? event.target.checked : event.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setStatusMessage("");
    setLoading(true);
    loginUser({ email: formValues.email, password: formValues.password })
      .then((data) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.access_token);
          try {
            const payload = parseJwt(data.access_token) || {};
            const profile = {
              email: payload.email || formValues.email,
              full_name: payload.full_name || payload.email || formValues.email,
              role: payload.role || data.role || "patient",
            };
            localStorage.setItem("user_profile", JSON.stringify(profile));
            const target =
              profile.role === "admin" ? "/admin" : profile.role === "expert" ? "/expert" : "/";
            router.push(target);
            return;
          } catch (e) {
            console.warn("Gagal membaca payload token", e);
          }
        }
        setStatusMessage("Login berhasil! Token disimpan. Silakan lanjut ke beranda.");
        router.push("/");
      })
      .catch((err) => {
        setError(err?.message || "Gagal login. Coba lagi.");
      })
      .finally(() => setLoading(false));
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__layout">
        <section className="auth-page__intro">
          <p className="auth-page__eyebrow">Portal Pengguna</p>
          <h1>Masuk untuk memantau risiko kanker payudara</h1>
          <p className="auth-page__description">
            Pantau riwayat diagnosis, perbarui data gejala, dan bagikan laporan Anda ke tenaga kesehatan dalam sekali klik.
            Setelah masuk, seluruh riwayat pemantauan risiko Anda tersinkron otomatis.
          </p>

          <ul className="auth-benefits">
            {benefits.map((item) => (
              <li key={item.title}>
                <span className="auth-benefits__title">{item.title}</span>
                <span className="auth-benefits__description">{item.description}</span>
              </li>
            ))}
          </ul>

          <div className="auth-page__cta">
            <Link href="/" className="auth-link">
              Kembali ke halaman utama
            </Link>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__header">
            <p>Selamat datang kembali</p>
            <h2>Masuk ke akun Anda</h2>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                inputMode="email"
                placeholder="nama@email.com"
                autoComplete="username"
                value={formValues.email}
                onChange={handleChange("email")}
                required
              />
            </label>

            <label className="auth-field">
              <span>Kata sandi</span>

              <div className="auth-field__password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  autoComplete="current-password"
                  value={formValues.password}
                  onChange={handleChange("password")}
                  required
                  minLength={6}
                />
                <button type="button" className="auth-toggle" onClick={togglePassword}>
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </label>

            <div className="auth-form__actions">
              <label className="auth-checkbox">
                <input type="checkbox" checked={formValues.rememberMe} onChange={handleChange("rememberMe")} />
                <span>Ingat saya</span>
              </label>

              <button type="button" className="auth-link auth-link--muted">
                Lupa kata sandi?
              </button>
            </div>

            {error && <p className="auth-status auth-status--error">{error}</p>}
            {statusMessage && <p className="auth-status">{statusMessage}</p>}

            <button type="submit" className="auth-submit" disabled={isSubmitDisabled || loading}>
              Masuk
            </button>
          </form>

          <p className="auth-card__footer">
            Belum punya akun?{" "}
            <Link href="/register" className="auth-link">
              Buat akun baru
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
