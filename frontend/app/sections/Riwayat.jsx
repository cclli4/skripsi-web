const dummyRiwayatItems = [
  {
    id: 1,
    risk_category: "Rendah",
    risk_value: "12%",
    description: "Pemeriksaan awal risiko jatuh.",
    created_at: "2024-04-11T09:32:00.000Z",
  },
  {
    id: 2,
    risk_category: "Sedang",
    risk_value: "46%",
    description: "Update skor setelah sesi fisioterapi.",
    created_at: "2024-04-19T14:12:00.000Z",
  },
  {
    id: 3,
    risk_category: "Rendah",
    risk_value: "18%",
    description: "Monitoring berkala harian.",
    created_at: "2024-04-22T07:50:00.000Z",
  },
  {
    id: 4,
    risk_category: "Tinggi",
    risk_value: "72%",
    description: "Laporan setelah pasien mengeluh pusing.",
    created_at: "2024-05-02T16:05:00.000Z",
  },
  {
    id: 5,
    risk_category: "Sedang",
    risk_value: "41%",
    description: "Evaluasi ulang setelah terapi okupasi.",
    created_at: "2024-05-06T08:17:00.000Z",
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

export default function RiwayatSection({ items }) {
  const displayItems = items && items.length > 0 ? items : dummyRiwayatItems;

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
          <div className="riwayat-chip">
            {displayItems.length} data • Terbaru lebih dulu
          </div>
        </div>
        {displayItems && displayItems.length > 0 ? (
          <ul className="riwayat-list">
            {displayItems.map((it) => {
              const createdAt = formatDate(it.created_at);
              const { display, percent } = parseRiskValue(it.risk_value);
              const description =
                it.description ||
                `Prediksi kategori ${it.risk_category || "tidak diketahui"} dengan skor ${display}.`;
              return (
                <li key={it.id || it.created_at} className="riwayat-card">
                  <span className="riwayat-card__dot" aria-hidden="true" />
                  <div className="riwayat-card__header">
                    <div>
                      <div className="riwayat-card__meta">
                        <span className="riwayat-card__id">#{it.id || "—"}</span>
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
    </section>
  );
}
