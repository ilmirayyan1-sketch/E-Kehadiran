// Fungsi untuk sentiasa mengemas kini paparan pratinjau (Live Preview) apabila guru menaip
function kemaskiniPratinjau() {
    const jenis = document.getElementById("inputJenis").value;
    const acara = document.getElementById("inputAcara").value;
    const guru = document.getElementById("inputGuru").value;
    const jawatan = document.getElementById("inputJawatan").value;

    document.getElementById("previewJenis").innerText = jenis;
    document.getElementById("previewAcara").innerText = acara;
    document.getElementById("previewGuru").innerText = guru;
    document.getElementById("previewJawatan").innerText = jawatan;
}

// Fungsi utama untuk menjana sijil dalam bentuk PDF secara pukal
function janaSijilPukal() {
    const senaraiNamaText = document.getElementById("inputNamaMurid").value.trim();
    
    if (!senaraiNamaText) {
        alert("Sila masukkan sekurang-kurangnya satu nama murid terlebih dahulu!");
        return;
    }

    // Pecahkan senarai nama berdasarkan baris baharu
    const senaraiNama = senaraiNamaText.split("\n").map(nama => nama.trim()).filter(nama => nama.length > 0);
    
    const jenis = document.getElementById("inputJenis").value;
    const acara = document.getElementById("inputAcara").value;
    const guru = document.getElementById("inputGuru").value;
    const jawatan = document.getElementById("inputJawatan").value;

    const tempContainer = document.getElementById("temp-output-container");
    tempContainer.innerHTML = ""; // Bersihkan kawasan pemrosesan sementara

    // Bina struktur HTML bagi setiap murid ke dalam kawasan pemrosesan sementara
    senaraiNama.forEach((nama, index) => {
        const uniquePageId = `sijil-page-${index}`;
        
        // Sijil HTML template
        const templateHtml = `
            <div class="sijil-container" id="${uniquePageId}" style="page-break-after: always; margin-bottom: 20px;">
                <div class="sijil-inner" style="border: 4px double #c5a880; height: 100%; width: 100%; padding: 25px; text-align: center; background-color: #fdfbf7; position: relative; box-sizing: border-box;">
                    <div style="font-size: 40px; color: #1a365d; margin-bottom: 5px;">
                        <span style="font-family: 'Segoe UI', sans-serif;">🏆</span>
                    </div>
                    <div style="font-family: 'Georgia', serif; font-size: 28px; color: #1a365d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">${jenis}</div>
                    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 3px; color: #c5a880; font-weight: bold; margin-bottom: 15px;">Dengan ini dianugerahkan kepada</div>
                    
                    <div style="font-family: 'Georgia', serif; font-size: 24px; color: #222; border-bottom: 2px solid #c5a880; display: inline-block; padding: 0 30px; margin: 15px 0; font-weight: bold; font-style: italic;">${nama}</div>
                    
                    <div style="font-size: 14px; line-height: 1.6; color: #555; max-width: 550px; margin: 0 auto 20px auto;">
                        di atas sumbangan, komitmen dan kecemerlangan yang telah ditunjukkan sepanjang menyertai <strong>${acara}</strong>. Terima kasih atas usaha murni yang diberikan.
                    </div>
                    
                    <div style="margin-top: 35px;">
                        <div style="font-weight: bold; border-top: 1px solid #aaa; display: inline-block; padding-top: 5px; width: 200px; font-size: 13px; color: #333;">${guru}</div>
                        <div style="font-size: 11px; color: #777; text-transform: uppercase;">${jawatan}</div>
                    </div>
                </div>
            </div>
        `;
        
        tempContainer.innerHTML += templateHtml;
    });

    // Pilihan konfigurasi untuk perpustakaan html2pdf
    const opt = {
        margin:       0,
        filename:     `Sijil_Pukal_${jenis.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'px', format: [800, 565], orientation: 'landscape' } // format sijil landskap
    };

    // Jalankan penukaran HTML ke fail PDF dan mulakan muat turun automatik
    alert(`Menjana ${senaraiNama.length} sijil secara pukal. Sila tunggu beberapa saat...`);
    
    html2pdf().set(opt).from(tempContainer).save().then(() => {
        tempContainer.innerHTML = ""; // Bersihkan semula kontena selepas siap muat turun
    });
}

// Cetus fungsi pratinjau awal sejurus sistem dimuatkan
document.addEventListener("DOMContentLoaded", () => {
    kemaskiniPratinjau();
});
