import Image from "next/image";

const highlightArticles = [
  {
    id: 1,
    title: "Gejala Umum Kanker Serviks",
    summary: "Kenali tanda awal seperti perdarahan tidak normal dan nyeri panggul sebelum terjadi progres lanjut.",
    tag: "Edukasi",
  },
  {
    id: 2,
    title: "Pentingnya Deteksi Dini",
    summary: "Pap smear dan IVA test menjadi kunci untuk meminimalkan risiko komplikasi jangka panjang.",
    tag: "Deteksi",
  },
  {
    id: 3,
    title: "Manajemen Risiko",
    summary: "Faktor gaya hidup, vaksinasi HPV, serta pemeriksaan rutin dapat mengurangi probabilitas risiko.",
    tag: "Pencegahan",
  },
  {
    id: 4,
    title: "Membaca Hasil Diagnosis",
    summary: "Pelajari bagaimana membaca hasil pemeriksaan mandiri sebelum berkonsultasi ke tenaga medis.",
    tag: "Panduan",
  },
  {
    id: 5,
    title: "Kasus Serupa",
    summary: "Rangkum studi kasus pasien dengan gejala mirip untuk membantu mengambil tindakan awal.",
    tag: "CBR",
  },
  {
    id: 6,
    title: "Langkah Berikutnya",
    summary: "Ketahui kapan harus segera ke fasilitas kesehatan setelah menemukan gejala mencurigakan.",
    tag: "Lanjutkan",
  },
  {
    id: 7,
    title: "Nutrisi Pendukung",
    summary: "Pola makan seimbang kaya antioksidan dapat membantu menjaga kesehatan jaringan payudara.",
    tag: "Gaya Hidup",
  },
  {
    id: 8,
    title: "Mindfulness & SADARI",
    summary: "Teknik relaksasi dan pemeriksaan mandiri rutin membantu mengenali perubahan tubuh lebih cepat.",
    tag: "Self Care",
  },
];

const cardThemes = [
  {
    background: "linear-gradient(135deg, #FFB6F0, #FFCDD1)",
    text: "#4D172B",
    meta: "#4D172B",
    ctaBg: "#FFFFFF",
    ctaColor: "#4D172B",
  },
  {
    background: "linear-gradient(135deg, #FFCDD1, #FFFFFF)",
    text: "#4D172B",
    meta: "#E87396",
    ctaBg: "#FFB6F0",
    ctaColor: "#4D172B",
  },
  {
    background: "linear-gradient(135deg, #E87396, #FFB6F0)",
    text: "#FFFFFF",
    meta: "#FFCDD1",
    ctaBg: "rgba(255,255,255,0.25)",
    ctaColor: "#FFFFFF",
  },
  {
    background: "linear-gradient(135deg, #FFB6F0, #E87396)",
    text: "#FFFFFF",
    meta: "#FFCDD1",
    ctaBg: "rgba(255,255,255,0.2)",
    ctaColor: "#FFFFFF",
  },
  {
    background: "linear-gradient(135deg, #FFB6F0, #FFFFFF)",
    text: "#4D172B",
    meta: "#E87396",
    ctaBg: "#FFCDD1",
    ctaColor: "#4D172B",
  },
  {
    background: "linear-gradient(135deg, #FFCDD1, #FFB6F0)",
    text: "#4D172B",
    meta: "#E87396",
    ctaBg: "#FFFFFF",
    ctaColor: "#4D172B",
  },
  {
    background: "linear-gradient(135deg, #E87396, #FFCDD1)",
    text: "#FFFFFF",
    meta: "#FFB6F0",
    ctaBg: "rgba(255,255,255,0.25)",
    ctaColor: "#FFFFFF",
  },
  {
    background: "linear-gradient(135deg, #FFB6F0, #FFCDD1)",
    text: "#4D172B",
    meta: "#E87396",
    ctaBg: "#FFFFFF",
    ctaColor: "#4D172B",
  },
];

const featuredArticle = {
  title: "Bagaimana Fuzzy Mamdani Membantu Diagnosis Awal?",
  excerpt:
    "Metode Fuzzy Mamdani memungkinkan penilaian risiko lebih manusiawi dengan mempertimbangkan ketidakpastian data pasien. Pelajari bagaimana metode ini dikombinasikan dengan Case-Based Reasoning untuk menghasilkan rekomendasi yang lebih personal.",
};

export default function InformasiSection() {
  return (
    <section id="informasi" className="section-full" style={{ scrollMarginTop: 80 }}>
      <div className="section-content informasi-section">
        <header className="informasi-header">
          <h1>A Safe Space to Learn</h1>
          <p>
            Knowing your body is an act of self-love. Here, you'll find simple info about common breast changes, what
            they might mean, and when you should check in with a professional. No heavy medical stuff -- just clear,
            friendly explanations made for everyday girls like us.
          </p>
        </header>

        <div className="informasi-grid">
          {highlightArticles.map(({ id, title, summary, tag }, index) => {
            const theme = cardThemes[index % cardThemes.length];
            return (
              <article
                key={id}
                className="informasi-card"
                style={{
                  background: theme.background,
                  color: theme.text,
                  "--card-meta-color": theme.meta,
                  "--card-cta-bg": theme.ctaBg,
                  "--card-cta-color": theme.ctaColor,
                }}
              >
                <div className="informasi-card__meta">{tag}</div>
                <h3>{title}</h3>
                <p>{summary}</p>
                <button type="button" className="informasi-card__cta" aria-label={`Baca ${title}`}>
                  &rarr;
                </button>
              </article>
            );
          })}
        </div>

        <div className="informasi-feature">
          <div className="informasi-feature__media">
            <Image
              src="/assets/informasi.jpg"
              alt="Ilustrasi edukasi kesehatan payudara"
              width={540}
              height={360}
              priority
            />
          </div>
          <div className="informasi-feature__content">
            <p className="eyebrow">Sorotan Mendalam</p>
            <h3>{featuredArticle.title}</h3>
            <p>{featuredArticle.excerpt}</p>
            <button type="button" className="informasi-feature__cta">
              Baca artikel lengkap &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
