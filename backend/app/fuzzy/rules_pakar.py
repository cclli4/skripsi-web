"""
Rule pakar manual R1–R16 (Rendah/Sedang/Tinggi) sesuai daftar yang diberikan.
Tidak ada rule otomatis dari data.
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
    # Rendah
    ExpertRule(
        "R1",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "sifat_benjolan": "Bisa digerakkan",
            "letak_benjolan": "Tidak terlihat",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "rasa_nyeri": "Tidak nyeri",
            "keluar_cairan_puting": "Tidak",
            "luka_di_puting": "Tidak",
        },
        "Rendah: tidak ada benjolan, bisa digerakkan, kulit sewarna, tanpa nyeri/cairan/luka",
    ),
    ExpertRule(
        "R2",
        "Rendah",
        {
            "benjolan_payudara": "Tidak ada",
            "sifat_benjolan": "Bisa digerakkan",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "perubahan_ukuran": "Tidak",
        },
        "Rendah: tidak ada benjolan, bisa digerakkan, kulit sewarna, tanpa perubahan ukuran",
    ),
    ExpertRule(
        "R3",
        "Rendah",
        {
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "perubahan_ukuran": "Tidak",
            "kecepatan_gejala": "> 12 bulan",
        },
        "Rendah: kulit sewarna, tidak ada perubahan ukuran, gejala muncul >12 bulan",
    ),
    ExpertRule(
        "R4",
        "Rendah",
        {
            "rasa_nyeri": "Nyeri ringan",
            "keluar_cairan_puting": "Tidak",
            "luka_di_puting": "Tidak",
            "benjolan_payudara": "Tidak ada",
        },
        "Rendah: nyeri ringan tanpa cairan & luka, dan tidak ada benjolan",
    ),
    ExpertRule(
        "R5",
        "Rendah",
        {
            "kecepatan_gejala": "< 1 minggu",
            "keluar_cairan_puting": ["Tidak", "Jernih", "Putih keruh seperti susu"],
        },
        "Rendah: gejala sangat cepat dengan cairan tidak/jernih/putih keruh",
    ),

    # Sedang
    ExpertRule(
        "R6",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Terbatas",
            "rasa_nyeri": "Nyeri ringan",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
            "keluar_cairan_puting": ["Tidak", "Jernih"],
        },
        "Sedang: benjolan terbatas, nyeri ringan, kulit sewarna, cairan tidak/jernih",
    ),

    ExpertRule(
        "R7",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Bisa digerakkan",
            "rasa_nyeri": "Nyeri ringan",
            "perubahan_ukuran": "Ya",
        },
        "Sedang: benjolan bisa digerakkan, nyeri ringan, ada perubahan ukuran",
    ),
    ExpertRule(
        "R8",
        "Sedang",
        {
            "kondisi_kulit_benjolan": "Kemerahan",
            "rasa_nyeri": "Nyeri ringan",
            "keluar_cairan_puting": ["Tidak", "Jernih"],
        },
        "Sedang: kemerahan + nyeri ringan + cairan tidak berat",
    ),
    ExpertRule(
        "R9",
        "Sedang",
        {
            "sifat_benjolan": "Terbatas",
            "rasa_nyeri": "Nyeri ringan",
            "keluar_cairan_puting": "Tidak",
            "kondisi_kulit_benjolan": "Sewarna Kulit",
        },
        "Sedang: benjolan terbatas, nyeri ringan, tanpa cairan, kulit sewarna",
    ),
    ExpertRule(
        "R10",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "letak_benjolan": "Teraba di dalam payudara",
            "sifat_benjolan": "Terbatas",
            "rasa_nyeri": ["Tidak nyeri", "Nyeri ringan"],
            "kecepatan_gejala": "> 12 bulan",
        },
        "Sedang: benjolan ada, letak teraba di dalam, terbatas, nyeri ringan/tidak, gejala >12 bulan",
    ),
    ExpertRule(
        "R11",
        "Sedang",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Bisa digerakkan",
            "perubahan_ukuran": "Ya",
            "kondisi_kulit_benjolan": ["Sewarna Kulit", "Kemerahan"],
            "keluar_cairan_puting": ["Tidak", "Jernih", "Putih keruh seperti susu"],
        },
        "Sedang: benjolan bisa digerakkan, ada perubahan ukuran, kulit sewarna/kemerahan ringan, cairan tidak/jernih/putih keruh",
    ),
    # Tinggi
    ExpertRule(
        "R12",
        "Tinggi",
        {
            "benjolan_payudara": "Ada",
            "sifat_benjolan": "Tidak bisa digerakkan",
            "kondisi_kulit_benjolan": "Kemerahan",
            "rasa_nyeri": "Nyeri berat",
        },
        "Tinggi: benjolan kaku, kemerahan, nyeri berat",
    ),
    ExpertRule(
        "R13",
        "Tinggi",
        {
            "keluar_cairan_puting": "Darah",
            "kondisi_kulit_benjolan": "Kemerahan",
        },
        "Tinggi: cairan darah + kulit kemerahan",
    ),
    ExpertRule(
        "R14",
        "Tinggi",
        {
            "sifat_benjolan": "Tidak bisa digerakkan",
            "keluar_cairan_puting": ["Darah", "Hitam"],
            "perubahan_ukuran": "Ya",
        },
        "Tinggi: benjolan tidak bisa digerakkan, cairan abnormal, ada perubahan ukuran",
    ),
    ExpertRule(
        "R15",
        "Tinggi",
        {
            "kecepatan_gejala": ["1-4 bulan", "5-12 bulan"],
            "keluar_cairan_puting": ["Putih keruh seperti susu", "Hitam", "Darah"],
        },
        "Tinggi: gejala 2-12 bulan dengan cairan putih keruh/hitam/darah",
    ),
    ExpertRule(
        "R16",
        "Tinggi",
        {
            "benjolan_payudara": "Ada",
            "benjolan_di_ketiak": "Ya",
            "keluar_cairan_puting": ["Darah", "Hitam", "Putih keruh seperti susu"],
        },
        "Tinggi: benjolan payudara + ketiak + cairan abnormal",
    ),
    ExpertRule(
        "R17",
        "Tinggi",
        {
            "kondisi_kulit_benjolan": "Kemerahan",
            "pembuluh_darah_permukaan": "Ya",
            "rasa_nyeri": "Nyeri berat",
        },
        "Tinggi: kulit kemerahan, pembuluh menonjol, nyeri berat",
    ),
    ExpertRule(
        "R18",
        "Tinggi",
        {
            "sifat_benjolan": "Tidak bisa digerakkan",
            "riwayat_keluarga": "Ya",
        },
        "Tinggi: benjolan kaku + riwayat keluarga",
    ),
]
