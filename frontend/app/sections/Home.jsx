import Image from "next/image";

export default function HomeSection() {
  return (
    <section id="home" className="hero" style={{ scrollMarginTop: 80 }}>
      <div className="hero-content hero-layout">
        <div className="hero-text">
          <div className="hero-copy">
            <div className="hero-copy__column hero-copy__column--headline">
              <h1>
                Your Breast Health, Made <span>Simple & Caring</span>
              </h1>
            </div>
            <div className="hero-copy__column hero-copy__column--cta">
              <p className="hero-copy__paragraph">
                Take a quick, calm, and comfy check to understand what your body's trying to tell you. Private, safe,
                and all about you.
                <br />
                This little assessment helps you notice early signs related to your breast health—nothing scary,
                nothing complicated. Just a gentle guide before you decide on your next step.
              </p>
              <div className="hero-actions hero-actions--right">
                <a href="#diagnosis" className="btn btn-primary">
                  Start My Check
                </a>
                <a href="#panduan" className="btn btn-secondary">
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-illustration">
          <Image
            src="/assets/home.webp"
            alt="Ilustrasi pemeriksaan payudara"
            width={640}
            height={420}
            style={{ width: "100%", height: "auto", borderRadius: "24px" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
