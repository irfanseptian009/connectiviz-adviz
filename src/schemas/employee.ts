import { z } from "zod";



export const karyawanUpdateSchema = z
  .object({
    id: z.number().optional(), 
    /* ----------- Akun & role (wajib) ----------- */
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"], {
      errorMap: () => ({ message: "Role wajib dipilih" }),
    }),
    password: z.string().optional(),

    /* -------------- Data Pribadi --------------- */
    namaLengkap: z.string().optional(),
    namaPerusahaan: z.string().optional(),
    namaPanggilan: z.string().optional(),
    jk: z.enum(["L", "P"]).optional(),
    employeeId: z.string().optional(),
    tempatLahir: z.string().optional(),
    noTelp: z.string().optional(),
    golDarah: z.enum(["A", "B", "AB", "O"]).optional(),
    statusMenikah: z.enum(["Belum Menikah", "Menikah", "Cerai"]).optional(),
    agama: z
      .enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"])
      .optional(),
    /* -------- Pekerjaan & Pendidikan ---------- */
    jabatan: z.string().optional(),
    statusKerja: z.enum(["Tetap", "Kontrak", "Outsourcing"]).optional(),
    tanggalMasuk: z.string().optional(),
    tanggalLahir: z.string().optional(),
    pendidikan: z
      .enum(["SMA/SMK", "D3", "S1", "S2", "S3"])
      .optional(),
    fakultas: z.string().optional(),
    jurusan: z.string().optional(),
    universitas: z.string().optional(),
    swastaNegeri: z.enum(["Swasta", "Negeri"]).optional(),
    ipk: z.string().optional(),
    /* -------------- Alamat & Dokumen ---------- */
    domisili: z.string().optional(),
    alamatDomisili: z.string().optional(),
    alamatKtp: z.string().optional(),
    noKtp: z.string().optional(),
    noKk: z.string().optional(),
    /* -------------- BPJS & Pajak -------------- */
    bpjsTk: z.string().optional(),
    bpjsKes: z.string().optional(),
    statusPtkp: z
      .enum([
        "TK/0",
        "TK/1",
        "TK/2",
        "TK/3",
        "K/0",
        "K/1",
        "K/2",
        "K/3",
      ])
      .optional(),
    kategoriPph: z.enum(["A", "B", "C"]).optional(),
    npwp: z.string().optional(),
    /* ---------------- Asuransi ---------------- */
    kartuAsuransi: z.string().optional(),
    memberNumber: z.string().optional(),
    noPolis: z.string().optional(),
    /* ------------ Kontak & Sosial ------------ */
    emailPribadi: z.string().optional(),
    emailPerusahaan: z.string().optional(),
    kontakDaruratNama: z.string().optional(),
    kontakDaruratHubungan: z.string().optional(),
    kontakDaruratHp: z.string().optional(),
    ig: z.string().optional(),
    linkedin: z.string().optional(),
    /* ----------------- Bank ------------------ */
    bank: z.string().optional(),
    noRekening: z.string().optional(),
    namaRekening: z.string().optional(),
  })
  .strict();

export type KaryawanUpdateDto = z.infer<typeof karyawanUpdateSchema>;
