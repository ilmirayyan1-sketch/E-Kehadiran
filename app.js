// ==========================================
// KONFIGURASI PROJEK FIREBASE ANDA (REAL-TIME CLOUD)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD_E15SVYx-cvQT07tJFzpiu5Vf8Na6Kp4",
  authDomain: "e-kehadiran-b6847.firebaseapp.com",
  projectId: "e-kehadiran-b6847",
  storageBucket: "e-kehadiran-b6847.firebasestorage.app",
  messagingSenderId: "332547811712",
  appId: "1:332547811712:web:7d429d06a0f02a389a7965",
  measurementId: "G-KR070XQ5PF"
};

// Mulakan Firebase & Firestore Database
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Membina Struktur Data Asal Sekiranya Awan Masih Kosong
const strukturAsal = {
    senaraiKelas: ["5 Sains", "5 Sastera"],
    pelajar: [
        { id: 1, nama: "Ahmad Ali", kelas: "5 Sains", rekod: {} },
        { id: 2, nama: "Siti Aminah", kelas: "5 Sains", rekod: {} },
        { id: 3, nama: "Chong Wei", kelas: "5 Sastera", rekod: {} }
    ]
};

let db = { senaraiKelas: [], pelajar: [] };

// Fungsi Utama untuk Memuatkan Data dari Cloud Firebase
async function mulakanDatabase() {
    try {
        const docRef = firestore.collection("e_kehadiran").doc("database_utama");
        const docSnap = await docRef.get();

        if (docSnap.exists()) {
            db = docSnap.data();
        } else {
            // Jika tiada data lagi di Cloud, hantar struktur asal sebagai pendaftaran pertama
            await docRef.set(strukturAsal);
            db = strukturAsal;
        }

        // Jalankan penjanaan visual antaramuka selepas data berjaya dimuat turun
        janaPilihanMinggu();
        janaPilihanKelas();
        tukarKonfigurasiSesi();
        paparLaporan();

    } catch (error) {
        console.error("Ralat memuatkan pangkalan data awan:", error);
    }
}

// Menjana Pilihan 20 Minggu Semester secara Automatik
function janaPilihanMinggu() {
    const pilihMinggu = document.getElementById("pilihMinggu");
    const laporanMinggu = document.getElementById("laporanMinggu");
    
    let htmlMinggu = "";
    for (let i = 1; i <= 20; i++) {
        htmlMinggu += `<option value="Minggu-${i}">Minggu ${i}</option>`;
    }
    
    if (pilihMinggu) pilihMinggu.innerHTML = htmlMinggu;
    if (laporanMinggu) {
        laporanMinggu.innerHTML = '<option value="semua">Keseluruhan Semester</option>' + htmlMinggu;
    }
}

// Kemas kini Pilihan Dropdown Kelas di index dan laporan
function janaPilihanKelas() {
    const pilihKelas = document.getElementById("pilihKelas");
    const laporanKelas = document.getElementById("laporanKelas");
    
    if (!db.senaraiKelas) return;
    let htmlKelas = db.senaraiKelas.map(k => `<option value="${k}">${k}</option>`).join("");
    
    if (pilihKelas) pilihKelas.innerHTML = htmlKelas;
    if (laporanKelas) laporanKelas.innerHTML = htmlKelas;
}

// Tambah Kelas Kustom Baru
async function tambahKelas() {
    const namaInput = document.getElementById("namaKelasBaru");
    let nama = namaInput.value.trim();
    if (!nama) return alert("Sila masukkan nama kelas!");
    if (db.senaraiKelas.includes(nama)) return alert("Kelas ini sudah wujud!");

    db.senaraiKelas.push(nama);
    
    try {
        await firestore.collection("e_kehadiran").doc("database_utama").set(db);
        namaInput.value = "";
        janaPilihanKelas();
        tukarKonfigurasiSesi();
        alert(`Kelas ${nama} berjaya didaftarkan ke Cloud!`);
    } catch (error) {
        alert("Gagal menyimpan ke awan!");
    }
}

// Tambah Pelajar Baru ke dalam kelas yang dipilih semasa
async function tambahPelajar() {
    const namaInput = document.getElementById("namaPelajarBaru");
    const kelasTerpilih = document.getElementById("pilihKelas").value;
    let nama = namaInput.value.trim();
    
    if (!nama) return alert("Sila masukkan nama pelajar!");
    
    let idBaru = db.pelajar.length > 0 ? db.pelajar[db.pelajar.length - 1].id + 1 : 1;
    db.pelajar.push({ id: idBaru, nama: nama, kelas: kelasTerpilih, rekod: {} });
    
    try {
        await firestore.collection("e_kehadiran").doc("database_utama").set(db);
        namaInput.value = "";
        tukarKonfigurasiSesi();
        alert(`Pelajar ${nama} dimasukkan ke kelas ${kelasTerpilih}!`);
    } catch (error) {
        alert("Ralat cloud: Gagal mendaftarkan pelajar.");
    }
}

// Paparkan senarai nama pelajar berdasarkan kelas yang dipilih guru
function tukarKonfigurasiSesi() {
    const pilihKelasElem = document.getElementById("pilihKelas");
    if (!pilihKelasElem) return;
    const kelasTerpilih = pilihKelasElem.value;
    const kontenaPelajar = document.getElementById("senaraiPelajar");
    if (!kontenaPelajar) return;

    let pelajarKelas = db.pelajar.filter(p => p.kelas === kelasTerpilih);
    kontenaPelajar.innerHTML = "";

    if (pelajarKelas.length === 0) {
        kontenaPelajar.innerHTML = `<p class="text-center text-muted py-3">Tiada pelajar lagi dalam kelas ini.</p>`;
        return;
    }

    pelajarKelas.forEach((pelajar, index) => {
        kontenaPelajar.innerHTML += `
            <div class="d-flex justify-content-between align-items-center p-3 student-row">
                <span class="fw-semibold">${index + 1}. ${pelajar.nama}</span>
                <div class="btn-group" role="group">
                    <input type="radio" class="btn-check" name="status-${pelajar.id}" id="hadir-${pelajar.id}" value="Hadir" checked>
                    <label class="btn btn-outline-success btn-sm px-3" for="hadir-${pelajar.id}"><i class="bi bi-check-circle"></i> Hadir</label>

                    <input type="radio" class="btn-check" name="status-${pelajar.id}" id="tidak-${pelajar.id}" value="Tidak Hadir">
                    <label class="btn btn-outline-danger btn-sm px-3" for="tidak-${pelajar.id}"><i class="bi bi-x-circle"></i> Ponteng</label>
                </div>
            </div>
        `;
    });
}

// Simpan data tandaan harian mengiringi struktur minggu
async function simpanKehadiran() {
    const tarikh = document.getElementById("tarikhKehadiran").value;
    const minggu = document.getElementById("pilihMinggu").value;
    const kelasTerpilih = document.getElementById("pilihKelas").value;
    
    if (!tarikh) return alert("Sila tetapkan tarikh!");

    let pelajarKelas = db.pelajar.filter(p => p.kelas === kelasTerpilih);

    pelajarKelas.forEach(pelajar => {
        const isHadir = document.getElementById(`hadir-${pelajar.id}`).checked;
        if (!pelajar.rekod) {
            pelajar.rekod = {};
        }
        if (!pelajar.rekod[minggu]) {
            pelajar.rekod[minggu] = [];
        }
        
        // Elakkan duplikasi data pada tarikh yang sama
        pelajar.rekod[minggu] = pelajar.rekod[minggu].filter(r => r.tarikh !== tarikh);
        pelajar.rekod[minggu].push({ tarikh: tarikh, status: isHadir ? "Hadir" : "Tidak Hadir" });
    });

    try {
        await firestore.collection("e_kehadiran").doc("database_utama").set(db);
        alert("Kehadiran hari ini berjaya dikunci dan disimpan ke Cloud Database!");
    } catch (error) {
        alert("Gagal menyegerakkan data ke Cloud.");
    }
}

// Memproses Analisis Kehadiran & Menyalakan Zon Amaran Merah (< 80%)
function paparLaporan() {
    const jadual = document.getElementById("jadualLaporan");
    if (!jadual) return;

    const laporKelasElem = document.getElementById("laporanKelas");
    const laporMingguElem = document.getElementById("laporanMinggu");
    if (!laporKelasElem || !laporMingguElem) return;

    const kelasTerpilih = laporKelasElem.value;
    const mingguTerpilih = laporMingguElem.value;

    let pelajarKelas = db.pelajar.filter(p => p.kelas === kelasTerpilih);
    jadual.innerHTML = "";

    pelajarKelas.forEach(pelajar => {
        let totalHari = 0;
        let hariHadir = 0;

        if (pelajar.rekod) {
            if (mingguTerpilih === "semua") {
                // Kira keseluruhan semester
                Object.keys(pelajar.rekod).forEach(mgu => {
                    pelajar.rekod[mgu].forEach(sesi => {
                        totalHari++;
                        if (sesi.status === "Hadir") hariHadir++;
                    });
                });
            } else {
                // Tapis satu minggu spesifik sahaja
                if (pelajar.rekod[mingguTerpilih]) {
                    pelajar.rekod[mingguTerpilih].forEach(sesi => {
                        totalHari++;
                        if (sesi.status === "Hadir") hariHadir++;
                    });
                }
            }
        }

        let peratus = totalHari === 0 ? 0 : ((hariHadir / totalHari) * 100);
        let statusKelasCSS = (peratus < 80 && totalHari > 0) ? "danger-alert" : "";
        let peratusTeksCSS = peratus < 80 ? "text-danger fw-bold" : "text-success fw-bold";

        jadual.innerHTML += `
            <tr class="${statusKelasCSS}">
                <td>${pelajar.nama}</td>
                <td>${hariHadir}</td>
                <td>${totalHari}</td>
                <td><span class="${peratusTeksCSS}">${peratus.toFixed(2)}%</span></td>
            </tr>
        `;
    });
}

// Padam Keseluruhan Pangkalan Data Awan (Kembali ke Struktur Asal)
async function padamSemuaData() {
    if (confirm("Adakah anda pasti mahu memadam semua rekod dan data pelajar dari Cloud Database?")) {
        try {
            await firestore.collection("e_kehadiran").doc("database_utama").set(strukturAsal);
            alert("Database dibersihkan!");
            location.reload();
        } catch (error) {
            alert("Gagal membersihkan database.");
        }
    }
}

// Cetus Pemuatan Database Sejurus Laman Dibuka
document.addEventListener("DOMContentLoaded", () => {
    mulakanDatabase();
});
