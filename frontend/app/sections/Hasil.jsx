import { diagnosisFields } from "./Diagnosis";

const riskThemes = {
  rendah: {
    label: "Risiko Rendah",
    color: "#16a34a",
    background: "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(21,128,61,0.08))",
    note: "Gejala tergolong ringan. Tetap pantau perubahan dan lakukan pemeriksaan mandiri secara rutin.",
  },
  sedang: {
    label: "Risiko Sedang",
    color: "#f97316",
    background: "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(234,88,12,0.08))",
    note: "Perlu perhatian lebih lanjut. Pertimbangkan konsultasi dengan tenaga kesehatan.",
  },
  tinggi: {
    label: "Risiko Tinggi",
    color: "#dc2626",
    background: "linear-gradient(135deg, rgba(220,38,38,0.18), rgba(185,28,28,0.08))",
    note: "Segera hubungi fasilitas kesehatan untuk penanganan lebih lanjut.",
  },
  default: {
    label: "Risiko Tidak Tersedia",
    color: "#64748b",
    background: "linear-gradient(135deg, rgba(100,116,139,0.12), rgba(71,85,105,0.06))",
    note: "Kirimkan gejala untuk melihat tingkat risiko.",
  },
};

const riskSequence = ["Rendah", "Sedang", "Tinggi"];

const dummyDiagnosisResult = {
  risk_category: "Sedang",
  risk_value: 0.64,
  recommendation:
    "Lakukan konsultasi ke fasilitas kesehatan dalam 1-2 minggu dan catat setiap perubahan yang terjadi.",
  detail: diagnosisFields.map((field, index) => ({
    key: field.key,
    label: field.label,
    helper: field.helper,
    example: field.options?.[1] ?? field.options?.[0] ?? "-",
    risk: riskSequence[index % riskSequence.length],
  })),
};

export default function HasilSection({ hasil }) {
  const hasRealResult = Boolean(hasil);
  const displayResult = hasRealResult ? hasil : dummyDiagnosisResult;
  const categoryKey = displayResult?.risk_category?.toLowerCase?.();
  const themeKey = categoryKey in riskThemes ? categoryKey : "default";
  const theme = riskThemes[themeKey] ?? riskThemes.default;
  const badgeBg = theme.badgeBackground ?? `${theme.color ?? "#4D172B"}1a`;
  const riskValue = typeof displayResult?.risk_value === "number" ? displayResult.risk_value : null;
  const riskPercent = riskValue !== null ? Math.min(Math.max(riskValue, 0), 1) * 100 : null;
  const detailItems = Array.isArray(displayResult?.detail) && displayResult.detail.length > 0
    ? displayResult.detail
    : dummyDiagnosisResult.detail;
  const similarCases =
    Array.isArray(displayResult?.similar_cases) && displayResult.similar_cases.length > 0
      ? displayResult.similar_cases
      : dummyDiagnosisResult.similar_cases;

  return (
    <section id="hasil" className="section-full" style={{ scrollMarginTop: 80 }}>
      <div className="section-content hasil-section">
        <header className="hasil-header">
          <div>
              {hasRealResult}
            <h2>Hasil Analisis</h2>
            <p className="hasil-header__copy">
              Tingkat risiko dihitung dari kombinasi gejala yang Anda pilih. Gunakan informasi ini untuk
              mengambil keputusan lanjutan yang tepat.
            </p>
          </div>
          {!hasRealResult}
        </header>

        <article
          className={`hasil-card hasil-card--${themeKey}`}
          style={{
            "--hasil-card-border": theme.border ?? theme.color ?? "#94a3b8",
            "--hasil-card-bg": theme.background ?? "#fff",
            "--hasil-card-badge-text": theme.color ?? "#4D172B",
            "--hasil-card-badge-bg": badgeBg,
            "--hasil-card-progress": theme.progressColor ?? theme.color ?? "#4D172B",
          }}
        >
          <header className="hasil-card__header">
            <span className="hasil-card__badge">
              {theme.label}
            </span>
            <h3>{riskValue !== null ? riskValue.toFixed(3) : displayResult.risk_value ?? "-"}</h3>
          </header>
          {riskPercent !== null && (
            <div className="hasil-card__progress">
              <div className="hasil-card__progress-track">
                <div
                  className="hasil-card__progress-value"
                  style={{ width: `${riskPercent.toFixed(0)}%` }}
                />
              </div>
              <span>{riskPercent.toFixed(0)}%</span>
            </div>
          )}
          <p className="hasil-card__note">{theme.note}</p>
          {displayResult.recommendation && (
            <p>
              <strong>Rekomendasi:</strong> {displayResult.recommendation}
            </p>
          )}
        </article>


        <div className="hasil-risk-panel">
          <header>
            <h3>Risiko per Gejala</h3>
            <p>Kami buatkan dummy satu contoh interpretasi untuk setiap field dalam formulir diagnosis.</p>
          </header>
          <ul className="hasil-risk-list">
            {detailItems.map((item) => {
              const riskKey = typeof item.risk === "string" ? item.risk.toLowerCase() : "default";
              return (
                <li key={item.key} className={`hasil-risk hasil-risk--${riskKey}`}>
                  <div className="hasil-risk__label">
                    <p>{item.label}</p>
                    {item.helper && <span>{item.helper}</span>}
                    {item.example && <em>Nilai contoh: {item.example}</em>}
                  </div>
                  <span className="hasil-risk__badge">{item.risk ?? "N/A"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
