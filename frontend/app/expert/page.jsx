"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchExpertCases, fetchExpertDiagnosis, uploadExpertCasesCsv } from "@/lib/api";
import { parseJwt } from "@/lib/auth";
import { buildFeatureEntries } from "@/lib/features";

export default function ExpertPage() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [activeDiagnosis, setActiveDiagnosis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const profile = useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("auth_token");
    return token ? parseJwt(token) : null;
  }, []);

  const caseCsvColumns = useMemo(
    () => ({
      benjolan_pada_payudara: "benjolan_payudara",
      sifat_benjolan: "sifat_benjolan",
      letak_benjolan: "letak_benjolan",
      benjolan_permukaan_kulit: "kondisi_kulit_benjolan",
      rasa_nyeri: "rasa_nyeri",
      puting_masuk_ke_dalam: "puting_masuk_dalam",
      keluar_cairan_dari_puting: "keluar_cairan_puting",
      luka_pada_puting_atau_sekitar_payudara: "luka_di_puting",
      terlihat_pembuluh_darah_menonjol: "pembuluh_darah_permukaan",
      gatal_atau_iritasi_di_payudara: "gatal_atau_iritasi",
      perubahan_ukuran_payudara: "perubahan_ukuran",
      benjolan_di_ketiak: "benjolan_di_ketiak",
      usia: "usia",
      riwayat_keluarga: "riwayat_keluarga",
      pernah_menyusui: "pernah_menyusui",
      siklus_menstruasi: "siklus_menstruasi",
      kecepatan_munculnya_gejala: "kecepatan_gejala",
      pola_makan_dan_gaya_hidup: "pola_makan_gaya_hidup",
      penurunan_berat_badan_tanpa_sebab: "penurunan_berat_badan",
      kelelahan_berkepanjangan: "kelelahan_berkepanjangan",
      label_risiko: "risk category label",
    }),
    []
  );

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    const role = profile?.role;
    if (!token || (role !== "expert" && role !== "admin")) {
      setError("Halaman ini khusus pakar (PK) atau admin/KE. Login dengan peran yang sesuai.");
      setLoading(false);
      return;
    }
    Promise.all([fetchExpertCases(token), fetchExpertDiagnosis(token)])
      .then(([casesRes, diagRes]) => {
        setCases(casesRes.items || []);
        setDiagnosis(diagRes.items || []);
        setActiveDiagnosis(null);
      })
      .catch((err) => setError(err?.message || "Gagal memuat data pakar"))
      .finally(() => setLoading(false));
  }, [profile]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    try {
      const res = await uploadExpertCasesCsv(file);
      setUploadMessage(res.message || "Upload berhasil. Dataset CBR diperbarui.");
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
      const [casesRes, diagRes] = await Promise.all([fetchExpertCases(token), fetchExpertDiagnosis(token)]);
      setCases(casesRes.items || []);
      setDiagnosis(diagRes.items || []);
    } catch (err) {
      setError(err?.message || "Gagal mengunggah CSV");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <p className="dash-eyebrow">Pakar (PK)</p>
          <h1>Validasi & Kasus Serupa</h1>
          <p>Lihat basis kasus CBR dan riwayat diagnosis untuk keperluan validasi pengetahuan.</p>
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

      {!loading && !error && (
        <>
          <div className="dash-panel">
            <h2>Perbarui basis kasus via CSV</h2>
            <p className="dash-note">
              Format wajib: kolom {Object.keys(caseCsvColumns).join(", ")}. Hanya peran PK/Admin yang bisa
              unggah. File akan menggantikan dataset CBR (DATA_CBR.csv).
            </p>
            <label className="upload-btn">
              <input type="file" accept=".csv" onChange={handleUpload} disabled={uploading} />
              {uploading ? "Mengunggah..." : "Pilih file CSV"}
            </label>
            {uploadMessage && <p className="dash-status">{uploadMessage}</p>}
          </div>

          <div className="dash-panel">
            <h2>Basis Kasus CBR (terbaru)</h2>
            {cases.length === 0 && <p>Belum ada kasus.</p>}
            <div className="dash-list">
              {cases.map((c) => (
                <div key={c.id} className="dash-list__item">
                  <div>
                    <p className="dash-list__title">Kasus #{c.id}</p>
                    <p className="dash-list__meta">
                      {c.created_at} - Risiko: <strong>{c.risk_category}</strong>{" "}
                      ({typeof c.risk_value === "number" ? c.risk_value.toFixed(2) : c.risk_value})
                    </p>
                  </div>
                  {c.recommendation && <p className="dash-list__desc">{c.recommendation}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <h2>Riwayat Diagnosis (terbaru)</h2>
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
        </>
      )}
    </div>
  );
}
