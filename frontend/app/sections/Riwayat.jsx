"use client";

import { useEffect, useState } from "react";
import { buildFeatureEntries } from "@/lib/features";

const dummyRiwayatItems = [
  {
    id: 1,
    risk_category: "Rendah",
    risk_value: "12%",
    description: "Pemeriksaan awal risiko jatuh.",
    created_at: "2024-04-11T09:32:00.000Z",
    features: {
      benjolan_payudara: "Tidak ada",
      rasa_nyeri: "Tidak nyeri",
      usia: 28,
    },
  },
  {
    id: 2,
    risk_category: "Sedang",
    risk_value: "46%",
    description: "Update skor setelah sesi fisioterapi.",
    created_at: "2024-04-19T14:12:00.000Z",
    features: {
      benjolan_payudara: "Ada",
      sifat_benjolan: "Terbatas",
      keluar_cairan_puting: "Jernih",
      usia: 35,
    },
  },
  {
    id: 3,
    risk_category: "Rendah",
    risk_value: "18%",
    description: "Monitoring berkala harian.",
    created_at: "2024-04-22T07:50:00.000Z",
    features: {
      gatal_atau_iritasi: "Kadang",
      perubahan_ukuran: "Tidak",
      usia: 30,
    },
  },
  {
    id: 4,
    risk_category: "Tinggi",
    risk_value: "72%",
    description: "Laporan setelah pasien mengeluh pusing.",
    created_at: "2024-05-02T16:05:00.000Z",
    features: {
      benjolan_payudara: "Ada",
      letak_benjolan: "Menonjol di permukaan",
      kondisi_kulit_benjolan: "Kemerahan",
      penurunan_berat_badan: "Ya",
      usia: 54,
    },
  },
  {
    id: 5,
    risk_category: "Sedang",
    risk_value: "41%",
    description: "Evaluasi ulang setelah terapi okupasi.",
    created_at: "2024-05-06T08:17:00.000Z",
    features: {
      benjolan_di_ketiak: "Tidak",
      riwayat_keluarga: "Tidak",
      pola_makan_gaya_hidup: "Kadang",
      usia: 40,
    },
  },
];

const getBadgeClass = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("rendah")) return "riwayat-card__badge riwayat-card__badge--rendah";
  if (normalized.includes("sedang")) return "riwayat-card__badge riwayat-card__badge--sedang";
  if (normalized.includes("tinggi")) return "riwayat-card__badge riwayat-card__badge--tinggi";
  return "riwayat-card__badge riwayat-card__badge--default";
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
};

const parseRiskValue = (value) => {
  if (value === null || value === undefined) return { display: "-", percent: 0 };

  const asNumber = Number(typeof value === "string" ? value.replace("%", "") : value);
  if (Number.isFinite(asNumber)) {
    const normalized = Math.abs(asNumber) > 1 ? asNumber : asNumber * 100;
    const decimals = normalized >= 100 ? 0 : normalized >= 10 ? 1 : 2;
    return {
      display: `${normalized.toFixed(decimals)}%`,
      percent: Math.max(0, Math.min(100, normalized)),
    };
  }

  return { display: String(value), percent: 0 };
};

export default function RiwayatSection({
  items,
  onClear,
  clearing = false,
  error = "",
  isLoggedIn = true,
}) {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    setActiveItem(null);
  }, [items]);

  const hasArray = Array.isArray(items);
  const hasItems = hasArray && items.length > 0;
  const showEmptyState = hasArray && items.length === 0;
  const displayItems = hasItems ? items : dummyRiwayatItems;
  const itemCount = hasArray ? items.length : displayItems.length;
  const canClear = typeof onClear === "function";
  const showLoginPrompt = !isLoggedIn;

  const openFeatures = (item) => {
    setActiveItem(item);
  };

  const closeFeatures = () => setActiveItem(null);

  return (
    <section id="riwayat" className="section-full riwayat-section" style={{ scrollMarginTop: 80 }}>
      <div className="section-content riwayat-content">
        <div className="riwayat-headline">
          <div>
            <p className="riwayat-eyebrow">Riwayat</p>
            <h2>Riwayat Diagnosis</h2>
            <p className="riwayat-subtitle">
              Lihat jejak hasil prediksi dan pantau perubahan skor risiko seiring waktu.
            </p>
          </div>
          <div className="riwayat-actions">
            <div className="riwayat-chip">{itemCount} data - Terbaru lebih dulu</div>
            {canClear && (
              <button
                type="button"
                className="riwayat-clear"
                onClick={onClear}
                disabled={clearing || !hasItems}
              >
                {clearing ? "Menghapus..." : "Hapus riwayat"}
              </button>
            )}
          </div>
        </div>
        {error && <p className="riwayat-error">{error}</p>}
        {showLoginPrompt ? (
          <div className="riwayat-empty">
            <p>Riwayat memerlukan login.</p>
            <span>Masuk dulu untuk melihat dan menyimpan riwayat diagnosis.</span>
          </div>
        ) : !showEmptyState && displayItems && displayItems.length > 0 ? (
          <ul className="riwayat-list">
            {displayItems.map((it) => {
              const createdAt = formatDate(it.created_at);
              const { display, percent } = parseRiskValue(it.risk_value);
              const description =
                it.description ||
                `Prediksi kategori ${it.risk_category || "tidak diketahui"} dengan skor ${display}.`;
              const idLabel = it.id ?? it.created_at ?? "-";
              const itemKey = it.id || it.created_at || description;

              return (
                <li key={itemKey} className="riwayat-card">
                  <span className="riwayat-card__dot" aria-hidden="true" />
                  <div className="riwayat-card__header">
                    <div>
                      <div className="riwayat-card__meta">
                        <span className="riwayat-card__id">#{idLabel}</span>
                        <time dateTime={it.created_at || ""}>{createdAt}</time>
                      </div>
                      <h3>{it.risk_category || "Tidak diketahui"}</h3>
                    </div>
                    <div className="riwayat-badge-stack">
                      <span className={getBadgeClass(it.risk_category)}>{display}</span>
                      <span className="riwayat-card__badge riwayat-card__badge--muted">
                        Skor risiko
                      </span>
                    </div>
                  </div>
                  <div className="riwayat-card__body">
                    <p className="riwayat-card__description">{description}</p>
                    <div className="riwayat-score">
                      <div className="riwayat-score__bar">
                        <span style={{ width: `${percent}%` }} aria-hidden="true" />
                      </div>
                      <span className="riwayat-score__note">
                        Semakin mendekati 100% berarti risiko lebih tinggi.
                      </span>
                    </div>
                  </div>
                  <div className="riwayat-card__footer">
                    <button
                      type="button"
                      className="riwayat-toggle"
                      onClick={() => openFeatures(it)}
                    >
                      Lihat gejala yang diinput
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="riwayat-empty">
            <p>Belum ada riwayat.</p>
            <span>Diagnosa pertama kamu akan muncul di sini setelah pengujian.</span>
          </div>
        )}
      </div>

      {activeItem && (
        <div className="riwayat-modal" role="dialog" aria-modal="true" aria-label="Detail gejala">
          <div className="riwayat-modal__backdrop" onClick={closeFeatures} />
          <div className="riwayat-modal__content">
            <header className="riwayat-modal__header">
              <div>
                <p className="riwayat-modal__eyebrow">Diagnosis #{activeItem.id ?? "-"}</p>
                <h3>{activeItem.risk_category || "Tidak diketahui"}</h3>
                <p className="riwayat-modal__meta">{formatDate(activeItem.created_at)}</p>
              </div>
              <button className="riwayat-modal__close" onClick={closeFeatures} aria-label="Tutup">
                ✕
              </button>
            </header>
            <p className="riwayat-modal__subtitle">Gejala yang diinput</p>
            <div className="riwayat-features">
              {buildFeatureEntries(activeItem.features || {}).length ? (
                <ul className="riwayat-feature-list">
                  {buildFeatureEntries(activeItem.features || {}).map((feat) => (
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
    </section>
  );
}
