import Image from "next/image";

const highlightArticles = [
  {
    id: 1,
    title: "6 Ciri-Ciri Kanker Payudara yang Sering Diabaikan",
    summary: "Tanda awal seperti perubahan kulit, benjolan, dan cairan dari puting sering luput diperhatikan.",
    tag: "Gejala",
    link: "https://www.alodokter.com/6-ciri-ciri-kanker-payudara-yang-sering-diabaikan",
  },
  {
    id: 2,
    title: "Kanker Payudara",
    summary: "Ulasan menyeluruh tentang penyebab, faktor risiko, dan tata laksana kanker payudara.",
    tag: "Dasar",
    link: "https://www.alodokter.com/kanker-payudara",
  },
  {
    id: 3,
    title: "Edukasi Bulan Kesadaran Kanker Payudara",
    summary: "Program literasi kesehatan RS Persahabatan untuk meningkatkan kewaspadaan dan deteksi dini.",
    tag: "Edukasi",
    link: "https://rspersahabatan.co.id/read/berita/edukasi-kesehatan-dalam-rangka-bulan-kesadaran-kanker-payudara-breast-cancer-awareness-month",
  },
  {
    id: 4,
    title: "5 Gejala Awal Kanker Payudara yang Sering Diabaikan",
    summary: "Kenali ciri awal seperti benjolan kecil, perubahan bentuk, atau rasa nyeri tersendiri.",
    tag: "Gejala",
    link: "https://www.halodoc.com/artikel/5-gejala-awal-kanker-payudara-yang-sering-diabaikan",
  },
  {
    id: 5,
    title: "Deteksi Dini Kanker Payudara",
    summary: "Panduan pemeriksaan payudara sendiri (SADARI) dan peran pemeriksaan klinis.",
    tag: "Deteksi",
    link: "https://www.mitrakeluarga.com/artikel/deteksi-dini-kanker-payudara",
  },
  {
    id: 6,
    title: "Mengenal Berbagai Tipe Kanker Payudara",
    summary: "Bedakan tipe-tipe kanker payudara untuk memahami pilihan terapi yang sesuai.",
    tag: "Tipe",
    link: "https://www.yayasankankerpayudaraindonesia.id/berita/read/10/mengenal-berbagai-tipe-kanker-payudara",
  },
  {
    id: 7,
    title: "Cegah Kanker Payudara dengan SADARI dan SADANIS",
    summary: "Panduan resmi Kemenkes untuk pemeriksaan mandiri dan klinis secara rutin.",
    tag: "Pencegahan",
    link: "https://kemkes.go.id/id/cegah-kanker-payudara-dengan-sadari-dan-sadanis",
  },
  {
    id: 8,
    title: "6 Pola Hidup Sehat Cegah Kanker Payudara",
    summary: "Gaya hidup sehat untuk menjaga kesehatan payudara, mulai pola makan hingga olahraga.",
    tag: "Gaya Hidup",
    link: "https://www.siloamhospitals.com/informasi-siloam/artikel/6-pola-hidup-sehat-cegah-kanker-payudara?utm_source=chatgpt.com",
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
  title: "Deteksi Dini Kanker Payudara dengan SADARI dan SADANIS",
  excerpt:
    "Langkah praktis memeriksa payudara sendiri dan pentingnya pemeriksaan klinis berkala untuk menemukan perubahan sedini mungkin.",
  link: "https://upk.kemkes.go.id/new/deteksi-dini-kanker-payudara-dengan-sadari-dan-sadanis?utm_source=chatgpt.com",
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
          {highlightArticles.map(({ id, title, summary, tag, link }, index) => {
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
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="informasi-card__cta"
                  aria-label={`Baca ${title}`}
                >
                  &rarr;
                </a>
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
            <a
              href={featuredArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="informasi-feature__cta"
            >
              Baca artikel lengkap &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
