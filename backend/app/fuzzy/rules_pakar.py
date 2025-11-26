"""
Daftar rule pakar yang diambil dari tabel R1-R16.

Setiap rule memuat label risiko dan kondisi yang harus dipenuhi.
Kondisi menggunakan key yang sama dengan field di frontend untuk mempermudah pencocokan.
"""

from __future__ import annotations

from typing import Dict, List, Union

RuleConditions = Dict[str, Union[str, List[str]]]


class ExpertRule:
    def __init__(self, code: str, risk: str, conditions: RuleConditions, note: str = "") -> None:
        self.code = code
        self.risk = risk
        self.conditions = conditions
        self.note = note


EXPERT_RULES: List[ExpertRule] = [
    ExpertRule(
        "R1",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "sifat_benjolan": "Bisa digerakkan",
            "letak_benjolan": "Tidak terlihat",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "rasa_nyeri": "Tidak nyeri",
            "kulit_payudara_berubah": "Tidak ada",
            "keluar_cairan_puting": "Tidak",
            "luka_di_puting": "Tidak",
        },
        "Tidak ada benjolan, kondisi kulit normal, tanpa nyeri dan cairan",
    ),
    ExpertRule(
        "R2",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "sifat_benjolan": "Tidak bisa digerakkan",
            "letak_benjolan": "Tidak terlihat",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "rasa_nyeri": "Tidak nyeri",
            "kulit_payudara_berubah": "Tidak ada",
            "perubahan_ukuran": "Tidak",
        },
        "Tidak ada benjolan, kulit normal, tidak ada perubahan ukuran",
    ),
    ExpertRule(
        "R3",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "perubahan_ukuran": "Tidak",
            "kecepatan_gejala": "5-12 bulan",
        },
        "Kulit sewarna, tidak ada perubahan ukuran, gejala muncul lambat",
    ),
    ExpertRule(
        "R4",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "rasa_nyeri": "Nyeri ringan",
            "keluar_cairan_puting": "Tidak",
            "luka_di_puting": "Tidak",
        },
        "Hanya nyeri ringan tanpa cairan dan luka",
    ),
    ExpertRule(
        "R5",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Agak kaku",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "keluar_cairan_puting": ["Jernih", "Tidak"],
        },
        "Benjolan agak kaku dengan cairan jernih",
    ),
    ExpertRule(
        "R5a",
        "Rendah",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Agak kaku",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "keluar_cairan_puting": "Tidak",
            "rasa_nyeri": ["Tidak nyeri", "Nyeri ringan"],
            "pembuluh_darah_permukaan": "Tidak",
        },
        "Benjolan agak kaku, kulit sewarna, tanpa cairan, nyeri ringan/tidak nyeri",
    ),
    ExpertRule(
        "R6",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Bisa digerakkan",
            "rasa_nyeri": "Nyeri ringan",
            "perubahan_ukuran": "Ya",
        },
        "Benjolan dapat digerakkan dengan nyeri ringan dan perubahan ukuran",
    ),
    ExpertRule(
        "R7",
        "Sedang",
        {
            "kondisi_kulit_benjolan": "Kemerahan",
            "rasa_nyeri": "Nyeri ringan",
            "kulit_payudara_berubah": "Ada",
            "keluar_cairan_puting": ["Tidak", "Jernih"],
        },
        "Kemerahan dengan nyeri ringan dan cairan tidak berat",
    ),
    ExpertRule(
        "R8",
        "Sedang",
        {
            "keluar_cairan_puting": ["Tidak", "Jernih", "Putih keruh seperti susu", "Hitam"],
            "kecepatan_gejala": "< 1 minggu",
        },
        "Gejala muncul cepat (<1 bulan) dengan cairan non-darah",
    ),
    ExpertRule(
        "R9",
        "Sedang",
        {
            "sifat_benjolan": "Tidak bisa digerakkan",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "rasa_nyeri": "Nyeri ringan",
            "keluar_cairan_puting": "Tidak",
        },
        "Benjolan tidak bisa digerakkan dengan nyeri ringan, tanpa cairan",
    ),
    ExpertRule(
        "R10",
        "Tinggi",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Tidak bisa digerakkan",
            "kondisi_kulit_benjolan": "Kemerahan",
            "rasa_nyeri": "Nyeri berat",
            "kulit_payudara_berubah": "Ada",
        },
        "Benjolan tidak bisa digerakkan, kemerahan, nyeri berat",
    ),
    ExpertRule(
        "R11",
        "Tinggi",
        {
            "kondisi_kulit_benjolan": "Kemerahan",
            "kulit_payudara_berubah": "Ada",
            "keluar_cairan_puting": "Darah",
        },
        "Kulit kemerahan dengan cairan darah",
    ),
    ExpertRule(
        "R12",
        "Tinggi",
        {
            "sifat_benjolan": "Agak kaku",
            "keluar_cairan_puting": ["Darah", "Jernih"],
            "perubahan_ukuran": "Ya",
        },
        "Benjolan agak kaku, cairan abnormal, ada perubahan ukuran",
    ),
    ExpertRule(
        "R13",
        "Tinggi",
        {
            "keluar_cairan_puting": ["Putih keruh seperti susu", "Hitam", "Darah"],
            "kecepatan_gejala": "< 1 minggu",
        },
        "Gejala muncul sangat cepat dengan cairan abnormal",
    ),
    ExpertRule(
        "R14",
        "Tinggi",
        {
            "benjolan_payudara": "Ada",
            "keluar_cairan_puting": ["Darah", "Jernih"],
            "perubahan_ukuran": "Ya",
            "benjolan_di_ketiak": "Ya",
        },
        "Benjolan di payudara dan ketiak + cairan abnormal",
    ),
    ExpertRule(
        "R15",
        "Tinggi",
        {
            "kondisi_kulit_benjolan": "Kemerahan",
            "rasa_nyeri": "Nyeri berat",
            "kulit_payudara_berubah": "Ada",
            "pembuluh_darah_permukaan": "Ya",
        },
        "Kemerahan, pembuluh darah menonjol, nyeri berat",
    ),
    ExpertRule(
        "R16",
        "Tinggi",
        {
            "sifat_benjolan": "Tidak bisa digerakkan",
            "riwayat_keluarga": "Ya",
        },
        "Benjolan tidak bisa digerakkan dengan riwayat keluarga",
    ),
    ExpertRule(
        "R17",
        "Tinggi",
        {
            "benjolan_payudara": "Ada",
            "pembuluh_darah_permukaan": "Ya",
            "perubahan_ukuran": "Ya",
            "keluar_cairan_puting": ["Tidak", "Jernih"],
            "rasa_nyeri": ["Tidak nyeri", "Nyeri ringan"],
        },
        "Pembuluh darah menonjol dan perubahan ukuran meski nyeri ringan",
    ),
    ExpertRule(
        "R18",
        "Tinggi",
        {
            "benjolan_di_ketiak": "Ya",
            "perubahan_ukuran": "Ya",
            "sifat_benjolan": "Tidak bisa digerakkan",
            "kecepatan_gejala": "< 1 minggu",
            "penurunan_berat_badan": "Ya",
        },
        "Perubahan ukuran cepat, benjolan ketiak kaku, penurunan berat badan",
    ),
    # Rules hasil mining data (kombinasi pendek, support >=5, confidence tinggi)
    ExpertRule(
        "DT1",
        "Tinggi",
        {"benjolan_di_ketiak": "Ya", "pola_makan_gaya_hidup": "Sering"},
        "Benjolan ketiak + pola makan/gaya hidup sering buruk",
    ),
    ExpertRule(
        "DT2",
        "Tinggi",
        {"sifat_benjolan": "Tidak bisa digerakkan", "keluar_cairan_puting": "Darah"},
        "Benjolan kaku + cairan darah",
    ),
    ExpertRule(
        "DT3",
        "Tinggi",
        {"keluar_cairan_puting": "Darah", "luka_di_puting": "Ada"},
        "Cairan darah + luka puting",
    ),
    ExpertRule(
        "DT4",
        "Tinggi",
        {"keluar_cairan_puting": "Darah", "penurunan_berat_badan": "Ya"},
        "Cairan darah + penurunan berat badan tanpa sebab",
    ),
    ExpertRule(
        "DT5",
        "Tinggi",
        {"sifat_benjolan": "Tidak bisa digerakkan", "pola_makan_gaya_hidup": "Sering"},
        "Benjolan kaku + pola makan/gaya hidup sering buruk",
    ),
    ExpertRule(
        "DT6",
        "Tinggi",
        {"gatal_atau_iritasi": "Sering", "pola_makan_gaya_hidup": "Sering"},
        "Gatal/iritasi sering + pola makan/gaya hidup sering buruk",
    ),
    ExpertRule(
        "DT7",
        "Tinggi",
        {"rasa_nyeri": "Nyeri berat", "keluar_cairan_puting": "Darah"},
        "Nyeri berat + cairan darah",
    ),
    ExpertRule(
        "DT8",
        "Tinggi",
        {"keluar_cairan_puting": "Darah", "siklus_menstruasi": "Sudah berhenti"},
        "Cairan darah + menstruasi sudah berhenti",
    ),
    ExpertRule(
        "DT9",
        "Tinggi",
        {"letak_benjolan": "Tidak terlihat", "keluar_cairan_puting": "Darah"},
        "Benjolan tidak terlihat + cairan darah",
    ),
    ExpertRule(
        "DT10",
        "Tinggi",
        {"keluar_cairan_puting": "Darah", "benjolan_di_ketiak": "Ya"},
        "Cairan darah + benjolan ketiak",
    ),
    ExpertRule(
        "DT11",
        "Tinggi",
        {"keluar_cairan_puting": "Jernih", "pembuluh_darah_permukaan": "Ya"},
        "Cairan jernih + pembuluh darah menonjol",
    ),
    ExpertRule(
        "DT12",
        "Tinggi",
        {"kondisi_kulit_benjolan": "Kemerahan", "keluar_cairan_puting": "Darah"},
        "Kulit kemerahan + cairan darah",
    ),
]
