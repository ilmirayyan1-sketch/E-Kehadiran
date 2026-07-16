// 1. Fungsi untuk mengambil data dari Local Storage (jika tiada, gunakan data asal)
function dapatkanDataPelajar() {
    const dataDisimpan = localStorage.getItem("rekod_kehadiran");
    
    if (dataDisimpan) {
        return JSON.parse(dataDisimpan);
    } else {
        // Data asal jika guru pertama kali membuka sistem ini
        const dataAsal = [
            { id: 1, nama: "Ahmad Ali", hadir: 0, totalHari: 0 },
            { id: 2, nama: "Siti Aminah", hadir: 0, totalHari: 0 },
            { id: 3, nama: "Chong Wei", hadir: 0, totalHari: 0 },
            { id: 4, nama: "Ramasamy", hadir: 0, totalHari: 0 }
        ];
        // Simpan data asal ini ke dalam Local Storage buat kali pertama
        localStorage.setItem("rekod_kehadiran", JSON.stringify(dataAsal));
        return dataAsal;
    }
}

// 2. Ambil data pelajar yang terkini
let dataPelajar = dapatkanDataPelajar();

// 3. Formula Pengiraan Peratusan Kehadiran
function kiraPeratus(hariHadir, totalHari) {
    if (totalHari === 0) return 0;
    let peratus = (hariHadir / totalHari) * 100;
    return peratus.toFixed(2);
}

// 4. Fungsi untuk menyimpan tanda kehadiran hari ini (Dipanggil apabila butang "Simpan" ditekan)
function simpanKehadiran() {
    const tarikh = document.getElementById("tarikhKehadiran").value;
    if (!tarikh) {
        alert("Sila pilih tarikh terlebih dahulu!");
        return;
    }

    // Kemas kini data kehadiran pelajar berdasarkan tandaan guru
    dataPelajar.forEach(pelajar => {
        // Cari pilihan radio (Hadir atau Tidak Hadir) bagi setiap pelajar
        const radioHadir = document.getElementById(`hadir-${pelajar.id}`);
        
        if (radioHadir) {
            pelajar.totalHari += 1; // Tambah total hari persekolahan sebanyak 1
            if (radioHadir.checked) {
                pelajar.hadir += 1; // Jika ditanda 'Hadir', tambah hari hadir sebanyak 1
            }
        }
    });

    // Simpan data terbaharu ini ke dalam Local Storage (Kekal selamanya di browser ini)
    localStorage.setItem("rekod_kehadiran", JSON.stringify(dataPelajar));
    
    alert("Rekod kehadiran hari ini telah berjaya disimpan!");
}

// 5. Fungsi untuk memaparkan data di halaman Laporan (laporan.html)
function paparLaporan() {
    const jadual = document.getElementById("jadualLaporan");
    if (!jadual) return;

    jadual.innerHTML = ""; // Bersihkan jadual asal

    dataPelajar.forEach(pelajar => {
        let peratus = kiraPeratus(pelajar.hadir, pellets = pelajar.totalHari);
        let warnaTeks = peratus >= 90 ? "text-success" : "text-danger";

        jadual.innerHTML += `
            <tr>
                <td>${pelajar.nama}</td>
                <td>${pelajar.hadir}</td>
                <td>${pelajar.totalHari}</td>
                <td><strong class="${warnaTeks}">${peratus}%</strong></td>
            </tr>
        `;
    });
}

// Jalankan fungsi papar laporan secara automatik jika berada di halaman laporan.html
document.addEventListener("DOMContentLoaded", () => {
    paparLaporan();
});
