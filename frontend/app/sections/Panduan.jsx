import Image from "next/image";

const steps = [
  {
    number: "01",
    label: "Pilih Gejala",
    detail: "Centang setiap gejala yang kamu rasakan sebagai dasar perhitungan.",
  },
  {
    number: "02",
    label: "Atur Intensitas",
    detail: "Isi skala 0-1 untuk menggambarkan seberapa kuat tiap gejala.",
  },
  {
    number: "03",
    label: "Pastikan Data",
    detail: "Cek ulang supaya tidak ada gejala atau nilai yang terlewat.",
  },
  {
    number: "04",
    label: "Kirim & Hitung",
    detail: "Tekan Kirim agar sistem menjalankan Fuzzy Mamdani dan CBR.",
  },
  {
    number: "05",
    label: "Baca Rekomendasi",
    detail: "Cermati tingkat risiko dan langkah lanjutan yang disarankan.",
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
        <div className="panduan-grid">
          <div className="panduan-grid__cell panduan-grid__intro">
            <h2 className="panduan-title">How It Works</h2>
            <p className="panduan-description">
              Here's a quick guide so you know exactly how to use this tool.<span className="panduan-copy__emphasis">No confusion, no stress. Just follow each
              step and you're all set!</span>
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
    </section>
  );
}
