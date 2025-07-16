export const crew = [
  { name: "Andika Aris", roles: [] },
  { name: "Adri Irfanto", roles: [] },
  { name: "Anindya Aulia", roles: [] },
  { name: "Audrey Aggessy", roles: [] },
  { name: "Delia Sagita", roles: [] },
  { name: "Helida Laylatus", roles: [] },
  { name: "Imam Affandi", roles: [] },
  { name: "Kevin Rizkianto", roles: [] },
  { name: "Nova Laksmana", roles: [] },
  { name: "Oktha Viano", roles: [] },
  { name: "Rafli Fadillah", roles: [] },
  { name: "Rully Okta", roles: [] },
  { name: "Romadhona Larasati", roles: [] },
];
export const tags = {
  projectType: [
    {
      title: "Unpaid",
      value: "Unpaid",
      color: "#3B060A",
    },
    {
      title: "Pitching",
      value: "Pitching",
      color: "#131D4F",
    },
  ],

  projectCategories: [
    {
      title: "Produksi",
      value: "Produksi",
      color: "#347433",
    },
    {
      title: "Dokumentasi",
      value: "Dokumentasi",
      color: "#B22222",
    },
    {
      title: "Motion",
      value: "Motion",
      color: "#E9A319",
    },
    {
      title: "Design",
      value: "Design",
      color: "#749BC2",
    },
  ],
};

export const roleProduction = [
  { id: 1, name: "Photographer" },
  { id: 2, name: "Videographer" },
  { id: 3, name: "Editor" },
  { id: 4, name: "Drone" },
  { id: 5, name: "Helper" },
  { id: 6, name: "FPV" },
  { id: 7, name: "Freelance" },
  { id: 8, name: "Lighting" },
  { id: 9, name: "Director" },
  { id: 10, name: "Art Prop" },
  { id: 11, name: "Sound" },
  { id: 12, name: "Logistik" },
  { id: 13, name: "Man Loc" },
  { id: 14, name: "BTS" },
  { id: 15, name: "Ass Dir" },
  { id: 16, name: "Tal Co" },
  { id: 17, name: "Ass Cam" },
  { id: 18, name: "DOP" },
  { id: 19, name: "Producer" },
  { id: 20, name: "Creative" },
  { id: 21, name: "Unit" },
  { id: 22, name: "Crew" },
  { id: 23, name: "Project Manager" },
  { id: 24, name: "Social Media" },
];
export const roleGraphic = [
  { id: 1, name: "Motion" },
  { id: 2, name: "Design Layout" },
  { id: 3, name: "Illustration" },
  { id: 4, name: "Layer Splitting" },
  { id: 5, name: "Compositing" },
  { id: 6, name: "VFX" },
  { id: 7, name: "Freelance" },
  { id: 8, name: "Voice Over" },
];

export const vidProd = {
  praprod: [
    {
      title: "Terima dan klarifikasi brief dari client",
      pic: "Project Manager",
    },
    {
      title: "Membuat script, storyboard, timeline, director board",
      pic: "Creative",
    },
    {
      title: "Survey lokasi produksi",
      pic: "Videographer / Art Prop",
    },
    { title: "Tentukan crew produksi", pic: "Project Manager" },
    { title: "Pra Produksi Meeting", pic: "Crew" },
    { title: "Cek dan siapkan peralatan", pic: "Unit" },
  ],
  prod: [
    {
      title: "Proses Syuting",
      pic: "Project Manager",
    },
    {
      title: "Transfer footage dari kamera ke storage",
      pic: "Videographer",
    },
    {
      title: "Backup footage dan mengorganisir file",
      pic: "Videographer",
    },
    {
      title: "Pengembalian alat",
      pic: "Unit",
    },
    {
      title: "Administrasi Berita Acara Produksi",
      pic: "Project Manager",
    },
  ],
  postprod: [
    {
      title: "Editing offline",
      pic: "Editor",
    },
    {
      title: "Pict Lock",
      pic: "Director",
    },
    {
      title: "Editing Online",
      pic: "Editor",
    },
    {
      title: "QC",
      pic: "Director",
    },
    {
      title: "Preview Client",
      pic: "Project Manager",
    },
    {
      title: "Revisi 1,2,3",
      pic: "Editor",
    },
    {
      title: "Buat versi final & versi sosmed",
      pic: "Editor",
    },
    {
      title: "Upload ke sosial media & arsip",
      pic: "Sosmed",
    },
  ],
  manafile: [
    {
      title: "Arsip file produksi",
      pic: "Project Manager",
    },
    {
      title: "Backup file final",
      pic: "Editor",
    },
    {
      title: "Dokumentasi project",
      pic: "Project Manager",
    },
  ],
};

export const design = {
  praprod: [
    {
      title: "Klarifikasi kebutuhan desain dengan client",
      pic: "Creative Director",
    },
    {
      title: "Buat konsep visual & kumpulkan referensi",
      pic: "Lead Designer",
    },
    {
      title: "Rancang jadwal pengerjaan desain",
      pic: "Account Executive",
    },
  ],
  prod: [
    {
      title: "Desain draft awal",
      pic: "Visual Designer",
    },
    {
      title: "Cek internal dan lakukan koreksi",
      pic: "Art Director",
    },
    {
      title: "Presentasikan desain ke client",
      pic: "Client Service",
    },
    {
      title: "Proses revisi tahap 1 sampai 3",
      pic: "Visual Designer",
    },
  ],
  postprod: [
    {
      title: "Siapkan versi final (print & digital)",
      pic: "Graphic Designer",
    },
    {
      title: "Export ke format akhir (JPG, PDF, PNG)",
      pic: "Graphic Designer",
    },
    {
      title: "Periksa kualitas dan kesesuaian",
      pic: "Art Director",
    },
  ],
  manafile: [
    {
      title: "Simpan file mentahan (PSD/AI)",
      pic: "Graphic Designer",
    },
    {
      title: "Simpan hasil akhir dalam arsip",
      pic: "Account Executive",
    },
    {
      title: "Catat dan dokumentasikan desain",
      pic: "Account Executive",
    },
  ],
};

export const motion = {
  praprod: [
    {
      title: "Diskusikan dan pahami brief motion",
      pic: "Motion Producer",
    },
    {
      title: "Rancang storyboard dan konsep visual",
      pic: "Animator",
    },
    {
      title: "Buat rencana waktu dan kumpulkan asset",
      pic: "Production Assistant",
    },
  ],
  prod: [
    {
      title: "Desain elemen visual (grafis, ilustrasi)",
      pic: "Graphic Artist",
    },
    {
      title: "Mulai animasi kasar (blocking stage)",
      pic: "Animator",
    },
    {
      title: "Lanjutkan animasi dengan detail penuh",
      pic: "Animator",
    },
    {
      title: "Tampilkan preview untuk tim internal",
      pic: "Motion Supervisor",
    },
  ],
  postprod: [
    {
      title: "Kirim draft animasi ke klien",
      pic: "Motion Producer",
    },
    {
      title: "Terapkan revisi dari feedback klien",
      pic: "Animator",
    },
    {
      title: "Final render dan penyempurnaan animasi",
      pic: "Animator",
    },
    {
      title: "Cek akhir dan ekspor dalam berbagai format",
      pic: "Motion Supervisor",
    },
  ],
  manafile: [
    {
      title: "Simpan file proyek AE",
      pic: "Animator",
    },
    {
      title: "Backup file hasil render akhir",
      pic: "Animator",
    },
    {
      title: "Simpan dokumentasi video motion",
      pic: "Motion Producer",
    },
  ],
};

export const dokumentasi = {
  praprod: [
    {
      title: "Terima brief dokumentasi event",
      pic: "Project Manager",
    },
    {
      title: "Survey lokasi & rundown",
      pic: "Photographer / Videographer",
    },
    {
      title: "Koordinasi dengan EO / panitia",
      pic: "Project Manager",
    },
  ],
  prod: [
    {
      title: "Proses dokumentasi foto & video",
      pic: "Photographer / Videographer",
    },
    {
      title: "Transfer dan backup file dokumentasi",
      pic: "Videographer",
    },
    {
      title: "Kembalikan alat dokumentasi",
      pic: "Unit",
    },
  ],
  postprod: [
    {
      title: "Editing foto dan video dokumentasi",
      pic: "Editor",
    },
    {
      title: "Preview internal & revisi",
      pic: "Creative Lead",
    },
    {
      title: "Preview ke client & revisi",
      pic: "Project Manager",
    },
    {
      title: "Finalisasi file dan export",
      pic: "Editor",
    },
  ],
  manafile: [
    {
      title: "Backup file foto/video mentah dan final",
      pic: "Editor",
    },
    {
      title: "Upload ke Google Drive / link sharing",
      pic: "Project Manager",
    },
    {
      title: "Dokumentasi project dan publikasi",
      pic: "Sosmed / PM",
    },
  ],
};

export const user = [
  {
    user: "blackfamz",
    password: "bendinongopi",
  },
];
