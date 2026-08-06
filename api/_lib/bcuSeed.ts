// Seed data transcribed from "Monitoring Dashboard BCU Program" (SdBi Juni 2026 report).
// Period this seed represents:
export const SEED_PERIOD = "2026-06-01";

export type SeedRow = {
  category: "grand" | "killer_staff" | "killer_nonstaff" | "reguler" | "mandatory" | "talent";
  rowType: "category_total" | "item";
  no: string;
  sasaran: string;
  approach: string;
  units: string;
  indent: 0 | 1 | 2 | 3;
  target2026: number;
  sdbiTarget: number | null;
  sdbiAktual: number | null;
  biTarget: number | null;
  biAktual: number | null;
};

const r = (
  category: SeedRow["category"],
  rowType: SeedRow["rowType"],
  no: string,
  sasaran: string,
  approach: string,
  units: string,
  indent: 0 | 1 | 2 | 3,
  target2026: number,
  sdbiTarget: number | null,
  sdbiAktual: number | null,
  biTarget: number | null,
  biAktual: number | null,
): SeedRow => ({ category, rowType, no, sasaran, approach, units, indent, target2026, sdbiTarget, sdbiAktual, biTarget, biAktual });

export const SEED_ROWS: SeedRow[] = [
  // ---- Grand total (BCU-wide, slide 1 header numbers) ----
  r("grand", "category_total", "", "", "Total Pencapaian BCU", "", 0, 6444, 2685, 2340, 936, 622),

  // ---- Category totals (from Program Scorecard, slide 1 — highest confidence numbers) ----
  r("killer_staff", "category_total", "", "", "Killer Program — Staff", "", 0, 1192, 537, 534, 220, 215),
  r("killer_nonstaff", "category_total", "", "", "Killer Program — Non-Staff", "", 0, 4665, 1811, 1466, 619, 309),
  r("reguler", "category_total", "", "", "Reguler Program", "", 0, 300, 180, 180, 55, 55),
  r("mandatory", "category_total", "", "", "Mandatory Program", "", 0, 157, 66, 73, 27, 28),
  r("talent", "category_total", "", "", "Talent Development Program", "", 0, 130, 87, 87, 15, 15),

  // ---- A. Killer Program - Staff ----
  r("killer_staff", "item", "1", "Staf Baru Operasional (Eksternal)", "Commisioning (NEOP)", "Batch", 1, 12, 4, 4, null, null),
  r("killer_staff", "item", "2", "Assistant under perform (Satis & Fair)", "Upskilling", "Batch", 1, 8, 4, 4, null, null),
  r("killer_staff", "item", "3", "Lulusan BDP (0-3 Thn)", "Upgrading", "Employee", 1, 142, 70, 70, 23, 23),
  r("killer_staff", "item", "4", "Assistant Late Track", "Retooling", "Employee", 1, 31, null, null, null, null),
  r("killer_staff", "item", "5", "Staf lulusan BDP", "JUMMPER (Lulusan BDP)", "Units", 1, 20, 8, 6, 2, 2),
  r("killer_staff", "item", "6", "Assistant Coord. by function", "Demo Prestasi", "Batch", 1, 102, null, null, null, null),
  r("killer_staff", "item", "7", "Staf Agronomy & Mill", "Fokus Kerja Utama", "", 1, 504, 368, 368, 180, 180),
  r("killer_staff", "item", "7.1", "", "Agronomy", "Employee", 2, 297, 179, 179, 96, 96),
  r("killer_staff", "item", "7.2", "", "Mill", "Employee", 2, 207, 151, 151, 68, 68),
  r("killer_staff", "item", "8", "Staf Agronomy, Mill, Traksi & Administrasi", "Workshop & Uji Kompetensi", "", 1, 256, 22, 22, 1, 1),
  r("killer_staff", "item", "8.1", "", "Agronomy", "", 2, 152, 5, 5, 1, 1),
  r("killer_staff", "item", "8.1.1", "", "Estate Manager", "Employee", 3, 16, 1, 1, null, null),
  r("killer_staff", "item", "8.1.2", "", "Agronomy Head Assistant", "Employee", 3, 15, 3, 3, 1, 1),
  r("killer_staff", "item", "8.1.3", "", "Agronomy Assistant", "Employee", 3, 121, 1, 1, null, null),
  r("killer_staff", "item", "8.2", "", "Mill", "", 2, 104, 17, 17, null, null),
  r("killer_staff", "item", "8.2.1", "", "Mill Manager", "Employee", 3, 17, 17, 17, null, null),
  r("killer_staff", "item", "8.2.2", "", "Mill Head Assistant", "Employee", 3, 17, null, null, null, null),
  r("killer_staff", "item", "8.2.3", "", "Mill Assistant", "Employee", 3, 70, null, null, null, null),
  r("killer_staff", "item", "9", "Manager, Head Assistant, Assistant", "Coaching Intervention", "", 1, 93, 49, 48, 11, 6),
  r("killer_staff", "item", "9.1", "", "Estate", "Units", 2, 65, 34, 34, 10, 5),
  r("killer_staff", "item", "9.2", "", "Mill", "Units", 2, 17, 13, 13, null, null),
  r("killer_staff", "item", "9.3", "", "Traksi", "Units", 2, 11, 2, 1, 1, 1),
  r("killer_staff", "item", "10", "All Staf", "SHAREvation", "Batch", 1, 24, 12, 12, 3, 3),

  // ---- B. Killer Program - Non-Staff ----
  r("killer_nonstaff", "item", "1", "Supervisi & Admin", "Klinik Kerja", "Batch", 1, 91, 29, 26, null, null),
  r("killer_nonstaff", "item", "1.1", "", "Klinik Kerja Mandor (KKM)", "Batch/Region", 2, 36, 12, 11, null, null),
  r("killer_nonstaff", "item", "1.2", "", "Klinik Kerja Engineering (KKE)", "Batch/MOH", 2, 15, 5, 4, null, null),
  r("killer_nonstaff", "item", "1.3", "", "Klinik Kerja Administrasi (KKA)", "Batch/Region", 2, 36, 12, 11, null, null),
  r("killer_nonstaff", "item", "1.4", "", "Klinik Kerja Traksi (KKT)", "Batch", 2, 4, null, null, null, null),
  r("killer_nonstaff", "item", "2", "Supervisi Agronomy & Mill", "Sertifikasi Kompetensi Mandor", "Employee", 1, 900, 165, 129, 19, 19),
  r("killer_nonstaff", "item", "2.1", "Mandor Kebun", "SKM Estate", "Employee", 2, 820, 146, 110, null, null),
  r("killer_nonstaff", "item", "2.2", "Mandor Mill", "SKM Mill", "Employee", 2, 80, 19, 19, 19, 19),
  r("killer_nonstaff", "item", "3", "Mandor Kebun", "Mandor 1 Development Program", "Employee", 1, 205, 205, 205, 67, 67),
  r("killer_nonstaff", "item", "4", "Mandor Kebun", "Penyegaran Teknikal Mandor Kebun", "Employee", 1, 1040, 373, 289, 90, 28),
  r("killer_nonstaff", "item", "5", "Operator Pabrik", "Penyegaran Teknikal Operator dan Mandor Mill", "Employee", 1, 914, 614, 497, 184, 141),
  r("killer_nonstaff", "item", "6", "Kerani & Admin", "Penyegaran Teknikal Kerani", "Employee", 1, 1183, 294, 189, 153, 27),
  r("killer_nonstaff", "item", "7", "Mekanik Traksi", "Pelatihan Mekanik Handal", "Employee", 1, 300, 99, 99, 79, null),
  r("killer_nonstaff", "item", "8", "OB & CleaningService", "Pelatihan OB & Cleaning Service (HO)", "Employee", 1, 32, 32, 32, 27, 27),

  // ---- C. Reguler Program ----
  r("reguler", "item", "1", "All Staff", "Block Curriculum Program (BCP)", "Batch", 1, 21, 10, 10, 6, 6),
  r("reguler", "item", "1.1", "Assistant/Officer", "Blok 1 - Assistant/Officer", "Batch", 2, 14, 10, 10, 6, 6),
  r("reguler", "item", "1.2", "Head Assistant/SH/Spc", "Blok 2 - Head Assistant/Section Head/Specialist", "Batch", 2, 3, null, null, null, null),
  r("reguler", "item", "1.3", "Manager/DH/Sr. Spc", "Blok 3 - Manager/Dept. Head/ Sr. Specialist", "Batch", 2, 3, null, null, null, null),
  r("reguler", "item", "1.4", "Regional Head/ GDH", "Blok 4 - RH/MOH/Group Dept. Head", "Batch", 2, 1, null, null, null, null),
  r("reguler", "item", "2", "Selected Staff BGA (Assistant/Officer - Dy./Head)", "Beasiswa BGA", "Employee", 1, 47, 47, 47, 47, 47),
  r("reguler", "item", "2.1", "Selected Staff (Assistant/Officer - Manager/SH)", "Beasiswa S1", "Employee", 2, 42, 42, 42, 42, 42),
  r("reguler", "item", "2.2", "Selected Staff (Head Assistant/SH - Manager/DH)", "Beasiswa S2", "Employee", 2, 3, 3, 3, 3, 3),
  r("reguler", "item", "2.3", "Selected Staff (Deputy/Head of)", "Beasiswa S3", "Employee", 2, 2, 2, 2, 2, 2),
  r("reguler", "item", "3", "Trainee entry level staff", "BDP (Basic Development Program)", "Batch", 1, 8, 6, 6, null, null),
  r("reguler", "item", "4", "Trainee entry level non-staff", "ELP (Elementary Development Program)", "Batch", 1, 6, 4, 4, 2, 2),
  r("reguler", "item", "5", "Staff Acting", "Pra Jabatan", "Batch", 1, 218, 113, 113, null, null),

  // ---- D. Mandatory Program ----
  r("mandatory", "item", "1", "", "Mandatory Program (Staf/ Non Staf)", "Employee", 1, 157, 66, 73, 27, 28),

  // ---- E. Talent Development Program ----
  r("talent", "item", "1", "RH, Manager, Assistant", "Talent Operasional", "Employee", 1, 96, 66, 66, 12, 12),
  r("talent", "item", "2", "GDH, DH, SH, Officer", "Talent Head Office", "Employee", 1, 34, 21, 21, 3, 3),
];
