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
      title: "Terima dan klarifikasi brief desain dari client",
      pic: "Project Manager",
    },
    {
      title: "Tentukan konsep visual dan referensi",
      pic: "Creative / Designer",
    },
    {
      title: "Susun timeline pengerjaan desain",
      pic: "Project Manager",
    },
  ],
  prod: [
    {
      title: "Pembuatan desain draft",
      pic: "Designer",
    },
    {
      title: "Review dan revisi internal",
      pic: "Creative Lead",
    },
    {
      title: "Kirim desain untuk preview client",
      pic: "Project Manager",
    },
    {
      title: "Revisi 1,2,3",
      pic: "Designer",
    },
  ],
  postprod: [
    {
      title: "Finalisasi desain (CMYK, RGB, Web)",
      pic: "Designer",
    },
    {
      title: "Export format yang diperlukan",
      pic: "Designer",
    },
    {
      title: "Quality Control final file",
      pic: "Creative Lead",
    },
  ],
  manafile: [
    {
      title: "Backup file mentah (AI/PSD)",
      pic: "Designer",
    },
    {
      title: "Arsip versi final",
      pic: "Project Manager",
    },
    {
      title: "Dokumentasi hasil desain",
      pic: "Project Manager",
    },
  ],
};

export const motion = {
  praprod: [
    {
      title: "Terima brief motion dari client",
      pic: "Project Manager",
    },
    {
      title: "Susun konsep motion dan storyboard",
      pic: "Motion Designer",
    },
    {
      title: "Susun jadwal dan asset yang dibutuhkan",
      pic: "Project Manager",
    },
  ],
  prod: [
    {
      title: "Buat asset grafis (vector, ilustrasi)",
      pic: "Designer",
    },
    {
      title: "Animasi tahap awal (blocking)",
      pic: "Motion Designer",
    },
    {
      title: "Animasi lengkap dengan timing",
      pic: "Motion Designer",
    },
    {
      title: "Preview untuk internal review",
      pic: "Creative Lead",
    },
  ],
  postprod: [
    {
      title: "Kirim preview ke client",
      pic: "Project Manager",
    },
    {
      title: "Revisi animasi",
      pic: "Motion Designer",
    },
    {
      title: "Finalisasi animasi dan render",
      pic: "Motion Designer",
    },
    {
      title: "QC dan format delivery",
      pic: "Creative Lead",
    },
  ],
  manafile: [
    {
      title: "Arsip file project After Effects",
      pic: "Motion Designer",
    },
    {
      title: "Backup versi render final",
      pic: "Motion Designer",
    },
    {
      title: "Dokumentasi hasil motion",
      pic: "Project Manager",
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
