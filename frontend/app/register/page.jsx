"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";

const highlights = [
  {
    title: "Data Terpusat",
    description: "Satu akun untuk menyimpan riwayat gejala dan hasil analisis risiko Anda.",
  },
  {
    title: "Kolaborasi Tenaga Medis",
    description: "Bagikan ringkasan risiko ke dokter atau perawat dengan mudah.",
  },
  {
    title: "Pengingat Terjadwal",
    description: "Jadwalkan pemeriksaan ulang dan dapatkan notifikasi tepat waktu.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMismatch =
    formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword;

  const isSubmitDisabled = useMemo(() => {
    return (
      !formValues.fullName ||
      !formValues.email ||
      !formValues.password ||
      !formValues.confirmPassword ||
      !formValues.agree ||
      passwordsMismatch
    );
  }, [formValues, passwordsMismatch]);

  const handleChange = (field) => (event) => {
    const value = field === "agree" ? event.target.checked : event.target.value;
    setStatusMessage("");
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (passwordsMismatch) {
      setStatusMessage("Kata sandi dan konfirmasi belum sama.");
      return;
    }
    setLoading(true);
    registerUser({
      full_name: formValues.fullName,
      email: formValues.email,
      password: formValues.password,
      role: "patient",
    })
      .then(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "user_profile",
            JSON.stringify({ full_name: formValues.fullName, email: formValues.email, role: "patient" })
          );
        }
        setStatusMessage("Registrasi berhasil! Mengalihkan ke halaman login...");
        router.push("/login");
      })
      .catch((err) => {
        setError(err?.message || "Registrasi gagal. Coba lagi.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-page__layout">
        <section className="auth-page__intro">
          <p className="auth-page__eyebrow">Buat Akun</p>
          <h1>Gabung dan kelola perjalanan kesehatan Anda</h1>
          <p className="auth-page__description">
            Daftarkan akun agar riwayat diagnosis, rekomendasi, dan catatan tindak lanjut tersimpan aman.
            Dengan akun ini, Anda bisa melanjutkan pemantauan risiko kapan saja.
          </p>
          <p className="auth-hint">
            Form ini khusus untuk pasien. Akun pakar/admin sudah dibuat terpusat dan cukup langsung login.
          </p>

          <ul className="auth-benefits">
            {highlights.map((item) => (
              <li key={item.title}>
                <span className="auth-benefits__title">{item.title}</span>
                <span className="auth-benefits__description">{item.description}</span>
              </li>
            ))}
          </ul>

          <div className="auth-page__cta">
            <Link href="/login" className="auth-link">
              Sudah punya akun? Masuk
            </Link>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__header">
            <p>Langkah awal</p>
            <h2>Daftar akun baru</h2>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Nama lengkap</span>
              <input
                type="text"
                placeholder="Nama sesuai identitas"
                autoComplete="name"
                value={formValues.fullName}
                onChange={handleChange("fullName")}
                required
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                inputMode="email"
                placeholder="nama@email.com"
                autoComplete="email"
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
                  autoComplete="new-password"
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

            <label className="auth-field">
              <span>Konfirmasi kata sandi</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                autoComplete="new-password"
                value={formValues.confirmPassword}
                onChange={handleChange("confirmPassword")}
                required
                minLength={6}
              />
              {passwordsMismatch && <small style={{ color: "#b91c1c" }}>Kata sandi belum sama.</small>}
            </label>

            <label className="auth-checkbox" style={{ marginTop: 4 }}>
              <input type="checkbox" checked={formValues.agree} onChange={handleChange("agree")} />
              <span>Saya setuju dengan kebijakan privasi dan penggunaan data.</span>
            </label>

            {error && <p className="auth-status auth-status--error">{error}</p>}
            {statusMessage && <p className="auth-status">{statusMessage}</p>}

            <button type="submit" className="auth-submit" disabled={isSubmitDisabled || loading}>
              Buat akun
            </button>
          </form>

          <p className="auth-card__footer">
            Atau kembali ke{" "}
            <Link href="/" className="auth-link">
              halaman utama
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
