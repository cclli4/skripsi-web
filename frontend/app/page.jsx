"use client";
import { useEffect, useState } from "react";
import { postDiagnosis, fetchHistory, clearHistory } from "@/lib/api";
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
  const [clearingHistory, setClearingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
      const logged = Boolean(token);
      setIsLoggedIn(logged);
      if (!logged) {
        setRiwayat([]);
        setHistoryError("Masuk untuk melihat riwayat.");
        return;
      }
      try {
        const data = await fetchHistory(token);
        setRiwayat(data.items || []);
        setHistoryError("");
      } catch (e) {
        console.warn("Gagal memuat riwayat", e);
        setHistoryError("Gagal memuat riwayat. Pastikan backend berjalan dan Anda sudah login.");
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await postDiagnosis(featureValues);
      const detail = diagnosisFields.map((field) => ({
        key: field.key,
        label: field.label,
        helper: field.helper,
        example: featureValues[field.key],
        risk: result.risk_category,
      }));
      setHasil({ ...result, detail });
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
      if (token) {
        const history = await fetchHistory(token);
        setRiwayat(history.items || []);
        setHistoryError("");
      }
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

  const handleClearHistory = async () => {
    if (clearingHistory) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    if (!token) {
      setHistoryError("Masuk untuk menghapus riwayat.");
      return;
    }
    setClearingHistory(true);
    setHistoryError("");
    try {
      await clearHistory();
      setRiwayat([]);
    } catch (err) {
      console.error(err);
      setHistoryError(err?.message || "Gagal menghapus riwayat. Pastikan backend berjalan dan mengizinkan permintaan.");
    } finally {
      setClearingHistory(false);
    }
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
      <RiwayatSection
        items={riwayat}
        onClear={handleClearHistory}
        clearing={clearingHistory}
        error={historyError}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
