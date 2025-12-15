"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAdminOverview, fetchExpertDiagnosis } from "@/lib/api";
import { parseJwt } from "@/lib/auth";
import { buildFeatureEntries } from "@/lib/features";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [diagnosis, setDiagnosis] = useState([]);
  const [activeDiagnosis, setActiveDiagnosis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const profile = useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("auth_token");
    return token ? parseJwt(token) : null;
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    const role = profile?.role;
    if (!token || role !== "admin") {
      setError("Halaman ini khusus admin/KE. Login sebagai admin untuk melanjutkan.");
      setLoading(false);
      return;
    }
    Promise.all([fetchAdminOverview(token), fetchExpertDiagnosis(token)])
      .then(([overview, diag]) => {
        setData(overview);
        setDiagnosis(diag.items || []);
        setActiveDiagnosis(null);
      })
      .catch((err) => setError(err?.message || "Gagal memuat ringkasan admin"))
      .finally(() => setLoading(false));
  }, [profile]);

  const cards = [
    { title: "Total Pengguna", value: data?.total_users ?? "-" },
    { title: "Pasien", value: data?.patients ?? "-" },
    { title: "Pakar (PK)", value: data?.experts ?? "-" },
    { title: "Admin/KE", value: data?.admins ?? "-" },
    { title: "Riwayat Diagnosis", value: data?.total_diagnosis ?? "-" },
    { title: "Basis Kasus CBR", value: data?.total_cases ?? "-" },
  ];

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <p className="dash-eyebrow">Admin / KE</p>
          <h1>Ringkasan sistem</h1>
          <p>Kelola pengetahuan, aturan fuzzy, dan basis kasus CBR dengan kredensial admin.</p>
        </div>
        <div className="dash-actions">
          <Link className="btn btn-primary" href="/">
            Kembali ke beranda
          </Link>
        </div>
      </div>

      {loading && <p>Memuat...</p>}
      {error && (
        <div className="dash-alert">
          {error}{" "}
          <button className="link-inline" onClick={() => router.push("/login")}>
            Login
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="dash-grid">
          {cards.map((item) => (
            <div key={item.title} className="dash-card">
              <p className="dash-card__label">{item.title}</p>
              <p className="dash-card__value">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="dash-panel">
          <h2>Riwayat Diagnosis</h2>
          {diagnosis.length === 0 && <p>Belum ada diagnosis.</p>}
          <div className="dash-list">
            {diagnosis.map((d) => {
              return (
                <div key={d.id} className="dash-list__item">
                  <div className="dash-list__row">
                    <div>
                      <p className="dash-list__title">Diagnosis #{d.id}</p>
                      <p className="dash-list__meta">
                        {d.created_at} - Risiko: <strong>{d.risk_category}</strong>{" "}
                        ({typeof d.risk_value === "number" ? d.risk_value.toFixed(2) : d.risk_value})
                      </p>
                    </div>
                    <button
                      type="button"
                      className="riwayat-toggle riwayat-toggle--small"
                      onClick={() => setActiveDiagnosis(d)}
                    >
                      Lihat gejala
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="dash-panel">
        <h2>Hak akses</h2>
        <ul>
          <li>Ubah aturan fuzzy (IF/THEN), membership, batas kategori risiko.</li>
          <li>Atur parameter CBR (bobot kesamaan, konfigurasi similarity).</li>
          <li>Perbarui daftar gejala/tipe input/rentang nilai.</li>
          <li>Validasi pengetahuan pakar sebelum rilis.</li>
        </ul>
        <p className="dash-note">
          Endpoint manajemen dapat diamankan dengan `require_roles("admin")` pada router terkait.
        </p>
      </div>

      {activeDiagnosis && (
        <div className="riwayat-modal" role="dialog" aria-modal="true" aria-label="Detail gejala">
          <div className="riwayat-modal__backdrop" onClick={() => setActiveDiagnosis(null)} />
          <div className="riwayat-modal__content">
            <header className="riwayat-modal__header">
              <div>
                <p className="riwayat-modal__eyebrow">Diagnosis #{activeDiagnosis.id ?? "-"}</p>
                <h3>{activeDiagnosis.risk_category || "Tidak diketahui"}</h3>
                <p className="riwayat-modal__meta">{activeDiagnosis.created_at}</p>
              </div>
              <button
                className="riwayat-modal__close"
                onClick={() => setActiveDiagnosis(null)}
                aria-label="Tutup"
              >
                ✕
              </button>
            </header>
            <p className="riwayat-modal__subtitle">Gejala yang diinput</p>
            <div className="riwayat-features riwayat-features--plain">
              {buildFeatureEntries(activeDiagnosis.features || {}).length ? (
                <ul className="riwayat-feature-list riwayat-feature-list--compact">
                  {buildFeatureEntries(activeDiagnosis.features || {}).map((feat) => (
                    <li key={feat.key} className="riwayat-feature">
                      <span className="riwayat-feature__name">{feat.label}</span>
                      <span className="riwayat-feature__value">{feat.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="riwayat-feature__empty">Data gejala tidak tersedia.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
