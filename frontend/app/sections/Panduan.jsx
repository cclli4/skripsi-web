import Image from "next/image";

const steps = [
  {
    number: "01",
    label: "Pilih Gejala",
    detail: "Centang gejala yang sedang kamu rasakan sebagai bahan cek awal.",
  },
  {
    number: "02",
    label: "Atur Intensitas",
    detail: "Pilih seberapa ringan atau berat keluhanmu, dari tidak terasa sampai sangat mengganggu.",
  },
  {
    number: "03",
    label: "Pastikan Data",
    detail: "Periksa lagi supaya tidak ada gejala atau nilai yang terlewat.",
  },
  {
    number: "04",
    label: "Kirim & Proses",
    detail: "Tekan Kirim dan biarkan sistem merangkum keluhanmu untuk memberi perkiraan risiko.",
  },
  {
    number: "05",
    label: "Baca Rekomendasi",
    detail: "Lihat tingkat risiko dan langkah lanjut yang disarankan, misalnya kapan perlu cek ke dokter.",
  },
];

function StepItem({ number, label, detail }) {
  return (
    <div className="panduan-step">
      <div className="panduan-step__number">{number}</div>
      <div className="panduan-step__content">
        <p className="panduan-step__label">{label}</p>
        <p className="panduan-step__detail">{detail}</p>
      </div>
    </div>
  );
}

export default function PanduanSection() {
  return (
    <section id="panduan" className="section-full" style={{ scrollMarginTop: 80 }}>
      <div className="section-content panduan-section">
        {/* Desktop/tablet layout (gambar di samping, langkah terdistribusi) */}
        <div className="panduan-desktop">
          <div className="panduan-grid">
            <div className="panduan-grid__cell panduan-grid__intro">
              <h2 className="panduan-title">How It Works</h2>
              <p className="panduan-description">
                Panduan singkat supaya kamu tahu cara pakai alat ini.
                <span className="panduan-copy__emphasis">Ikuti langkah berikut, mudah dan jelas kok.</span>
              </p>
              <StepItem {...steps[0]} />
            </div>

            <div className="panduan-grid__cell panduan-grid__visual">
              <div className="panduan-visual">
                <Image
                  src="/assets/panduan.png"
                  alt="Ilustrasi alur penggunaan sistem"
                  width={360}
                  height={260}
                  priority
                />
              </div>
            </div>

            <div className="panduan-grid__cell">
              <StepItem {...steps[1]} />
            </div>
            <div className="panduan-grid__cell">
              <StepItem {...steps[3]} />
            </div>
            <div className="panduan-grid__cell">
              <StepItem {...steps[2]} />
            </div>
            <div className="panduan-grid__cell">
              <StepItem {...steps[4]} />
            </div>
          </div>
        </div>

        {/* Mobile layout (gambar di atas, langkah 1-5 berurutan) */}
        <div className="panduan-mobile">
          <div className="panduan-mobile__header">
            <h2 className="panduan-title">How It Works</h2>
            <p className="panduan-description">
              Panduan singkat supaya kamu tahu cara pakai alat ini.
              <span className="panduan-copy__emphasis">Ikuti langkah berikut, mudah dan jelas kok.</span>
            </p>
          </div>
          <div className="panduan-visual">
            <Image
              src="/assets/panduan.png"
              alt="Ilustrasi alur penggunaan sistem"
              width={360}
              height={260}
              priority
            />
          </div>
          <div className="panduan-steps">
            {steps.map((step) => (
              <StepItem key={step.number} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
