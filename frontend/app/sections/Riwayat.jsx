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

export default function RiwayatSection({ items }) {
  const displayItems = items && items.length > 0 ? items : dummyRiwayatItems;

  return (
    <section id="riwayat" className="section-full riwayat-section" style={{ scrollMarginTop: 80 }}>
      <div className="section-content riwayat-content">
        <h2>Riwayat</h2>
        {displayItems && displayItems.length > 0 ? (
          <ul className="riwayat-list">
            {displayItems.map((it) => {
              const createdAt = new Date(it.created_at);
              return (
                <li key={it.id} className="riwayat-card">
                  <span className="riwayat-card__dot" aria-hidden="true" />
                  <div className="riwayat-card__header">
                    <div>
                      <div className="riwayat-card__meta">
                        <span className="riwayat-card__id">#{it.id}</span>
                        <time dateTime={createdAt.toISOString()}>
                          {createdAt.toLocaleString()}
                        </time>
                      </div>
                      <h3>{it.risk_category || "Tidak diketahui"}</h3>
                    </div>
                    <span className={getBadgeClass(it.risk_category)}>{it.risk_value || "-"}</span>
                  </div>
                  <p className="riwayat-card__description">{it.description}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Belum ada riwayat.</p>
        )}
      </div>
    </section>
  );
}
