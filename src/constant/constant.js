// export const roleProduction = [
//   { id: 1, name: "Photographer" },
//   { id: 2, name: "Videographer" },
//   { id: 3, name: "Editor" },
//   { id: 4, name: "Drone" },
//   { id: 5, name: "Helper" },
//   { id: 6, name: "FPV" },
//   { id: 7, name: "Freelance" },
//   { id: 8, name: "Lighting" },
//   { id: 9, name: "Director" },
//   { id: 10, name: "Art Prop" },
//   { id: 11, name: "Sound" },
//   { id: 12, name: "Logistik" },
//   { id: 13, name: "Man Loc" },
//   { id: 14, name: "BTS" },
//   { id: 15, name: "Ass Dir" },
//   { id: 16, name: "Tal Co" },
//   { id: 17, name: "Ass Cam" },
//   { id: 18, name: "DOP" },
//   { id: 19, name: "Producer" },
//   { id: 20, name: "Creative" },
//   { id: 21, name: "Unit" },
//   { id: 23, name: "Project Manager" },
//   { id: 24, name: "Social Media" },
//   { id: 25, name: "Motion" },
//   { id: 26, name: "Design Layout" },
//   { id: 27, name: "Illustration" },
//   { id: 28, name: "Layer Splitting" },
//   { id: 29, name: "Compositing" },
//   { id: 30, name: "VFX" },
//   { id: 31, name: "Freelance" },
//   { id: 32, name: "Voice Over" },
//   { id: 22, name: "Crew" },
// ];
// export const roleGraphic = [
//   { id: 1, name: "Motion" },
//   { id: 2, name: "Design Layout" },
//   { id: 3, name: "Illustration" },
//   { id: 4, name: "Layer Splitting" },
//   { id: 5, name: "Compositing" },
//   { id: 6, name: "VFX" },
//   { id: 7, name: "Freelance" },
//   { id: 8, name: "Voice Over" },
// ];
// Static crew list - now using crewImport hook from CrewImport.jsx
// export const crew = [
//   { name: "Andika Aris", roles: [] },
//   { name: "Adri Irfanto", roles: [] },
//   { name: "Anindya Aulia", roles: [] },
//   { name: "Audrey Agessy", roles: [] },
//   { name: "Delia Sagita", roles: [] },
//   { name: "Helida Laylatus", roles: [] },
//   { name: "Imam Affandi", roles: [] },
//   { name: "Kevin Rizkianto", roles: [] },
//   { name: "Nova Laksmana", roles: [] },
//   // { name: "Oktha Viano", roles: [] },
//   { name: "Rafli Fadillah", roles: [] },
//   { name: "Rully Okta", roles: [] },
//   { name: "Romadhona Larasati", roles: [] },
// ];
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
      color: "#8A0000",
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
      color: "#090040",
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
// Kanban default value
export const vidProd = {
  praprod: [
    { title: "Crew Listing", pic: "Crew" },
    { title: "Klarifikasi brief dari client", pic: "Project Manager" },
    { title: "Susun script, storyboard & tentukan crew", pic: "Creative / PM" },
    { title: "Survey lokasi & cek peralatan", pic: "Videographer / Unit" },
  ],
  prod: [
    { title: "Proses syuting", pic: "Project Manager" },
    { title: "Transfer & backup footage", pic: "Videographer" },
  ],
  postprod: [
    { title: "Editing (offline & online)", pic: "Editor" },
    { title: "Revisi & QC", pic: "Director / Editor" },
    { title: "Versi final & upload ke sosial media", pic: "Editor / Sosmed" },
  ],
  manafile: [
    { title: "Berita acara produksi", pic: "Project Manager" },
    { title: "Backup file final & arsip", pic: "Editor" },
    { title: "Upload file ke Google Drive", pic: "Project Manager" },
    { title: "Dokumentasi project", pic: "Project Manager" },
  ],
};

export const dokumentasi = {
  praprod: [
    { title: "Crew Listing", pic: "Crew" },
    {
      title: "Klarifikasi brief & survey lokasi",
      pic: "Project Manager / Photographer",
    },
    { title: "Koordinasi dengan panitia", pic: "Project Manager" },
  ],
  prod: [
    { title: "Dokumentasi foto & video", pic: "Photographer / Videographer" },
    { title: "Transfer & backup dokumentasi", pic: "Videographer" },
    { title: "Pengembalian alat", pic: "Unit" },
  ],
  postprod: [
    { title: "Editing & revisi dokumentasi", pic: "Editor / Creative Lead" },
    { title: "Finalisasi & upload ke sosial media", pic: "Editor / Sosmed" },
  ],
  manafile: [
    { title: "Berita acara produksi", pic: "Project Manager" },
    { title: "Backup file mentah & final", pic: "Editor" },
    { title: "Upload ke Google Drive", pic: "Project Manager" },
    { title: "Dokumentasi project & publikasi", pic: "PM / Sosmed" },
  ],
};

export const design = {
  praprod: [
    { title: "Klarifikasi kebutuhan desain", pic: "Creative Director" },
    { title: "Buat konsep visual & jadwal", pic: "Lead Designer / AE" },
  ],
  prod: [
    {
      title: "Desain draft & revisi internal",
      pic: "Visual Designer / Art Director",
    },
    { title: "Revisi client hingga final", pic: "Visual Designer" },
  ],
  postprod: [
    { title: "Export file final (print & digital)", pic: "Graphic Designer" },
    { title: "Cek kualitas & kesesuaian", pic: "Art Director" },
    { title: "Upload hasil akhir ke Google Drive", pic: "Account Executive" },
  ],
  manafile: [
    { title: "Berita acara produksi", pic: "Project Manager" },
    { title: "Simpan file mentahan & final", pic: "Graphic Designer" },
    { title: "Dokumentasikan desain", pic: "Account Executive" },
  ],
};

export const motion = {
  praprod: [
    { title: "Diskusi brief & storyboard", pic: "Motion Producer / Animator" },
    { title: "Persiapan asset & jadwal", pic: "Production Assistant" },
  ],
  prod: [
    {
      title: "Desain elemen visual & animasi kasar",
      pic: "Graphic Artist / Animator",
    },
    {
      title: "Lanjutkan animasi & preview internal",
      pic: "Animator / Motion Supervisor",
    },
  ],
  postprod: [
    {
      title: "Kirim draft ke client & revisi",
      pic: "Motion Producer / Animator",
    },
    {
      title: "Render final & upload ke sosial media",
      pic: "Animator / Sosmed",
    },
  ],
  manafile: [
    { title: "Berita acara produksi", pic: "Project Manager" },
    { title: "Simpan file proyek & render akhir", pic: "Animator" },
    { title: "Upload file ke Google Drive", pic: "Motion Producer" },
    { title: "Dokumentasi video motion", pic: "Motion Producer" },
  ],
};

export const user = [
  {
    privilege: "user",
    user: "blackfamz",
    password: "bendinongopi",
  },
  {
    privilege: "pm",
    user: "blackstdpm",
    password: "blckstdpm",
  },
  {
    privilege: "finance",
    user: "blackstdfinance",
    password: "blckfn",
  },
  {
    privilege: "masteruser",
    user: "main",
    password: "blck",
  },
];
