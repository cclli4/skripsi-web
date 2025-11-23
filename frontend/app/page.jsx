"use client";
import { useEffect, useState } from "react";
import { postDiagnosis, fetchHistory } from "@/lib/api";
import Nav from "./components/Nav";
import HomeSection from "./sections/Home";
import InformasiSection from "./sections/Informasi";
import PanduanSection from "./sections/Panduan";
import DiagnosisSection, { diagnosisFields } from "./sections/Diagnosis";
import HasilSection from "./sections/Hasil";
import RiwayatSection from "./sections/Riwayat";

const defaultFeatureValues = diagnosisFields.reduce((acc, field) => {
  if (field.defaultValue !== undefined) {
    acc[field.key] = field.defaultValue;
  } else if (field.options?.length) {
    acc[field.key] = field.options[0];
  } else {
    acc[field.key] = "";
  }
  return acc;
}, {});

export default function SinglePage() {
  const [featureValues, setFeatureValues] = useState(() => ({ ...defaultFeatureValues }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHistory();
        setRiwayat(data.items || []);
      } catch (e) {
        console.warn("Gagal memuat riwayat", e);
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await postDiagnosis(featureValues);
      setHasil(result);
      const data = await fetchHistory();
      setRiwayat(data.items || []);
      const el = document.getElementById("hasil");
      el?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Gagal mengirim diagnosis. Pastikan backend berjalan dan CORS diizinkan.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (key, value) => {
    setFeatureValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Nav />
      <HomeSection />
      <div style={{ height: 20 }} />
      <InformasiSection />
      <div style={{ height: 20 }} />
      <PanduanSection />
      <div style={{ height: 20 }} />
      <DiagnosisSection
        values={featureValues}
        onChange={handleFeatureChange}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
      <div style={{ height: 20 }} />
      <HasilSection hasil={hasil} />
      <div style={{ height: 20 }} />
      <RiwayatSection items={riwayat} />
    </>
  );
}
