"use client";

import { useEffect, useRef, useState } from "react";

function DiagnosisSelect({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedValue = value ?? field.options?.[0] ?? "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    if (option !== selectedValue) {
      onChange(field.key, option);
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`custom-select ${open ? "custom-select--open" : ""}`}
      ref={containerRef}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="custom-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedValue}</span>
        <span className="custom-select__caret" aria-hidden="true" />
      </button>
      <ul className="custom-select__options" role="listbox">
        {field.options?.map((option) => (
          <li
            key={option}
            className={`custom-select__option ${
              option === selectedValue ? "custom-select__option--selected" : ""
            }`}
            role="option"
            aria-selected={option === selectedValue}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const diagnosisFields = [
  {
    key: "benjolan_payudara",
    label: "Benjolan pada Payudara",
    helper: "Apakah terdapat benjolan yang terasa di payudara.",
    options: ["Tidak ada", "Ada"],
  },
  {
    key: "sifat_benjolan",
    label: "Sifat Benjolan",
    helper: "Karakteristik pergerakan benjolan saat diraba.",
    options: ["Bisa digerakkan", "Agak kaku", "Tidak bisa digerakkan"],
  },
  {
    key: "letak_benjolan",
    label: "Letak Benjolan",
    helper: "Posisi benjolan relatif terhadap permukaan kulit.",
    options: [
      "Tidak terlihat",
      "Menonjol pada permukaan kulit",
      "Permukaan kulit tampak benjolan",
    ],
  },
  {
    key: "kondisi_kulit_benjolan",
    label: "Kondisi Kulit di Sekitar Benjolan",
    helper: "Perubahan warna atau kilau pada kulit di area benjolan.",
    options: ["Kemerahan", "Sewarna Kulit", "Mengkilat"],
  },
  {
    key: "rasa_nyeri",
    label: "Rasa Nyeri",
    helper: "Tingkat rasa nyeri yang dirasakan.",
    options: ["Tidak nyeri", "Nyeri ringan", "Nyeri berat"],
  },
  {
    key: "kulit_payudara_berubah",
    label: "Kulit Payudara Berubah",
    helper: "Apakah ada perubahan tekstur kulit payudara.",
    options: ["Tidak ada", "Ada"],
  },
  {
    key: "puting_masuk_dalam",
    label: "Puting Masuk ke Dalam",
    helper: "Perubahan arah atau posisi puting.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "keluar_cairan_puting",
    label: "Keluar Cairan dari Puting",
    helper: "Jenis cairan yang keluar dari puting.",
    options: ["Tidak", "Jernih", "Putih keruh seperti susu", "Hitam", "Darah"],
  },
  {
    key: "luka_di_puting",
    label: "Luka di Puting atau Sekitar",
    helper: "Apakah ada luka di area puting.",
    options: ["Tidak", "Ada"],
  },
  {
    key: "pembuluh_darah_permukaan",
    label: "Tampak Pembuluh Darah di Permukaan",
    helper: "Apakah pembuluh darah tampak jelas di permukaan kulit.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "gatal_atau_iritasi",
    label: "Gatal atau Iritasi di Payudara",
    helper: "Frekuensi gatal atau iritasi yang dirasakan.",
    options: ["Tidak", "Kadang", "Sering"],
  },
  {
    key: "perubahan_ukuran",
    label: "Perubahan Ukuran Payudara",
    helper: "Apakah ada perbedaan ukuran yang terasa.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "benjolan_di_ketiak",
    label: "Benjolan di Ketiak",
    helper: "Apakah teraba benjolan di area ketiak.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "usia",
    label: "Usia",
    helper: "Kelompok usia saat ini.",
    options: ["Muda", "Menengah", "Tua"],
  },
  {
    key: "riwayat_keluarga",
    label: "Riwayat Keluarga",
    helper: "Riwayat kanker payudara dalam keluarga.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "pernah_menyusui",
    label: "Pernah Menyusui",
    helper: "Apakah pernah memiliki riwayat menyusui.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "siklus_menstruasi",
    label: "Siklus Menstruasi",
    helper: "Apakah masih mengalami menstruasi.",
    options: ["Masih menstruasi", "Sudah berhenti"],
  },
  {
    key: "kecepatan_gejala",
    label: "Kecepatan Munculnya Gejala",
    helper: "Perkiraan waktu munculnya gejala sejak awal terasa.",
    options: ["< 1 minggu", "1-4 bulan", "5-12 bulan", "> 12 bulan"],
  },
  {
    key: "pola_makan_gaya_hidup",
    label: "Pola Makan & Gaya Hidup",
    helper: "Frekuensi kebiasaan kurang sehat yang dijalani.",
    options: ["Jarang", "Kadang", "Sering"],
  },
  {
    key: "penurunan_berat_badan",
    label: "Penurunan Berat Badan Tanpa Sebab",
    helper: "Apakah berat badan turun tanpa penyebab jelas.",
    options: ["Tidak", "Ya"],
  },
  {
    key: "kelelahan_berkepanjangan",
    label: "Kelelahan Berkepanjangan",
    helper: "Frekuensi rasa lelah berkepanjangan.",
    options: ["Tidak", "Kadang", "Sering"],
  },
];

export default function DiagnosisSection({ values, onChange, loading, error, onSubmit }) {
  return (
    <section id="diagnosis" className="section-full" style={{ scrollMarginTop: 80 }}>
      <div className="section-content diagnosis-section">
        <header className="diagnosis-header">
          <h1>Tell Us What You Feel</h1>
          <p className="diagnosis-description">
            Choose the symptoms that match what you're experiencing. Just be honest with yourself. <span className="diagnosis-copy__emphasis">Everything stays private, and it only takes a moment.</span> 
          </p>
        </header>
        <form onSubmit={onSubmit} className="diagnosis-form">
          <div className="diagnosis-grid">
            {diagnosisFields.map((field) => (
              <label key={field.key} className="diagnosis-field">
                <span className="diagnosis-field__label">{field.label}</span>
                {field.helper && <span className="diagnosis-field__helper">{field.helper}</span>}
                <DiagnosisSelect field={field} value={values[field.key]} onChange={onChange} />
              </label>
            ))}
          </div>
          <div className="diagnosis-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Processing..." : "Show My Result"}
            </button>
            {error && <p className="diagnosis-error">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
