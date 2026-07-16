let senaraiLogoBase64 = []; // Menyimpan semua imej logo dalam base64

// Menguruskan interaksi dropdown Jenis Sijil (Kustom vs Standard)
function kemaskiniPilihanJenis() {
    const selectElem = document.getElementById("inputJenis");
    const inputJenisKustom = document.getElementById("inputJenisKustom");
    
    if (selectElem.value === "KUSTOM") {
        inputJenisKustom.classList.remove("d-none");
    } else {
        inputJenisKustom.classList.add("d-none");
    }
    kemaskiniPratinjau();
}

// Menukar tema warna luar sijil
function tukarTemaSijil() {
    const activeTheme = document.getElementById("selectTheme").value;
    const previewContainer = document.getElementById("sijilPreview");
    
    // Simpan orientasi sedia ada
    const isPortrait = previewContainer.classList.contains("sijil-portrait");
    const orientClass = isPortrait ? "sijil-portrait" : "sijil-landscape";
    
    previewContainer.className = `sijil-container ${activeTheme} ${orientClass}`;
}

// Menguruskan penukaran Orientasi (Landscape vs Portrait)
function tukarOrientasi() {
    const previewContainer = document.getElementById("sijilPreview");
    const isPortrait = document.getElementById("orientPortrait").checked;
    const badge = document.getElementById("badgeOrientasi");
    
    // Set Semula kedudukan elemen ke lokasi asal berpusat dinamik mengikut orientasi
    const dragLogo = document.getElementById("dragLogoArea");
    const dragJenis = document.getElementById("dragJenis");
    const dragSub = document.getElementById("dragSub");
    const dragNama = document.getElementById("dragNama");
    const dragUlasan = document.getElementById("dragUlasan");
    const dragTandatangan = document.getElementById("dragTandatangan");

    // Padam sisa drag-and-drop manual sebelum ini supaya menggunakan CSS default
    [dragLogo, dragJenis, dragSub, dragNama, dragUlasan, dragTandatangan].forEach(el => {
        el.style.left = "";
        el.style.top = "";
        el.style.transform = "";
    });

    if (isPortrait) {
        previewContainer.classList.remove("sijil-landscape");
        previewContainer.classList.add("sijil-portrait");
        badge.innerHTML = `<i class="bi bi-phone-landscape-fill" style="transform: rotate(90deg); display: inline-block;"></i> Portrait A4 Standard`;
        
        // CSS Posisi Default untuk Portrait (A4: 595 x 842)
        dragLogo.style.cssText = "top: 50px; left: 50%; transform: translateX(-50%); display: flex; gap: 15px; justify-content: center; align-items: center;";
        dragJenis.style.cssText = "top: 170px; left: 50%; transform: translateX(-50%); width: 85%; text-align: center;";
        dragSub.style.cssText = "top: 250px; left: 50%; transform: translateX(-50%); width: 85%; text-align: center;";
        dragNama.style.cssText = "top: 310px; left: 50%; transform: translateX(-50%); width: 90%; text-align: center;";
        dragUlasan.style.cssText = "top: 420px; left: 50%; transform: translateX(-50%); width: 85%; text-align: center;";
        dragTandatangan.style.cssText = "bottom: 70px; left: 50%; transform: translateX(-50%); width: 70%; text-align: center;";
    } else {
        previewContainer.classList.remove("sijil-portrait");
        previewContainer.classList.add("sijil-landscape");
        badge.innerHTML = `<i class="bi bi-aspect-ratio"></i> Landskap A4 Standard`;
        
        // CSS Posisi Default untuk Landscape (A4: 842 x 595)
        dragLogo.style.cssText = "top: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 18px; justify-content: center; align-items: center;";
        dragJenis.style.cssText = "top: 125px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center;";
        dragSub.style.cssText = "top: 185px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center;";
        dragNama.style.cssText = "top: 220px; left: 50%; transform: translateX(-50%); width: 90%; text-align: center;";
        dragUlasan.style.cssText = "top: 300px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center;";
        dragTandatangan.style.cssText = "bottom: 45px; left: 50%; transform: translateX(-50%); width: 60%; text-align: center;";
    }
}

// Menguruskan input muat naik imej logo pukal
function prosesMuatNaikLogo() {
    const files = document.getElementById("inputLogos").files;
    const dragLogoArea = document.getElementById("dragLogoArea");
    
    if (files.length === 0) return;
    
    dragLogoArea.innerHTML = ""; // Bersihkan ikon piala laluan
    senaraiLogoBase64 = []; // Set semula senarai logo
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            senaraiLogoBase64.push(base64Data);
            
            // Masukkan gambar ke dalam bekas drag logo
            const imgHtml = `<img src="${base64Data}" class="logo-img" alt="Logo">`;
            dragLogoArea.innerHTML += imgHtml;
        }
        reader.readAsDataURL(file);
    });
}

// Memperbaharui teks pratinjau dinamik
function kemaskiniPratinjau() {
    const selectJenis = document.getElementById("inputJenis").value;
    const inputJenisKustom = document.getElementById("inputJenisKustom").value.trim();
    
    let jenisSijilAkhir = selectJenis;
    if (selectJenis === "KUSTOM") {
        jenisSijilAkhir = inputJenisKustom ? inputJenisKustom : "Sijil Kustom Anda";
    }

    const acara = document.getElementById("inputAcara").value;
    const guru = document.getElementById("inputGuru").value;
    const jawatan = document.getElementById("inputJawatan").value;

    document.getElementById("previewJenis").innerText = jenisSijilAkhir;
    document.getElementById("previewAcara").innerText = acara;
    document.getElementById("previewGuru").innerText = guru;
    document.getElementById("previewJawatan").innerText = jawatan;
}

// ----------------------------------------------------
// SISTEM ENGINE UNTUK MENGALIKAN (DRAG & DROP) ELEMEN
// ----------------------------------------------------
function aktifkanSistemDrag() {
    const elements = document.querySelectorAll('.draggable-text');
    let activeElement = null;
    let offsetLeft = 0;
    let offsetTop = 0;

    elements.forEach(element => {
        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Hanya klik kiri
            
            activeElement = element;
            
            const rect = element.getBoundingClientRect();
            offsetLeft = e.clientX - rect.left;
            offsetTop = e.clientY - rect.top;
            
            element.style.borderColor = "#d4af37";
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeElement) return;

        const container = document.getElementById("sijilPreview");
        const containerRect = container.getBoundingClientRect();

        let newX = e.clientX - containerRect.left - offsetLeft;
        let newY = e.clientY - containerRect.top - offsetTop;

        const elementRect = activeElement.getBoundingClientRect();
        const maxX = containerRect.width - elementRect.width;
        const maxY = containerRect.height - elementRect.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        activeElement.style.left = `${newX}px`;
        activeElement.style.top = `${newY}px`;
        activeElement.style.transform = "none"; // Padam default translate
    });

    document.addEventListener('mouseup', () => {
        if (activeElement) {
            activeElement.style.borderColor = "transparent";
            activeElement = null;
        }
    });
}

function dapatkanGayaPosisi(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return "";
    
    const left = element.style.left;
    const top = element.style.top;
    const transform = element.style.transform;
    
    let styleString = "";
    if (left) styleString += `left: ${left}; `;
    if (top) styleString += `top: ${top}; `;
    if (transform) styleString += `transform: ${transform}; `;
    
    return styleString;
}

// ----------------------------------------------------
// PENJANAAN PDF SECARA PUKAL (SAIZ A4 DINAMIK)
// ----------------------------------------------------
function janaSijilPukal() {
    const senaraiNamaText = document.getElementById("inputNamaMurid").value.trim();
    
    if (!senaraiNamaText) {
        alert("Sila masukkan senarai nama penerima terlebih dahulu!");
        return;
    }

    const senaraiNama = senaraiNamaText.split("\n").map(n => n.trim()).filter(n => n.length > 0);
    
    const selectJenis = document.getElementById("inputJenis").value;
    const inputJenisKustom = document.getElementById("inputJenisKustom").value.trim();
    let jenisSijilAkhir = selectJenis;
    if (selectJenis === "KUSTOM") {
        jenisSijilAkhir = inputJenisKustom ? inputJenisKustom : "Sijil";
    }

    const acara = document.getElementById("inputAcara").value;
    const guru = document.getElementById("inputGuru").value;
    const jawatan = document.getElementById("inputJawatan").value;
    const activeTheme = document.getElementById("selectTheme").value;

    // Baca pilihan orientasi dinamik
    const isPortrait = document.getElementById("orientPortrait").checked;
    const orientasiSijil = isPortrait ? "sijil-portrait" : "sijil-landscape";
    const dimensiPDF = isPortrait ? [595, 842] : [842, 595];
    const orientasiPDF = isPortrait ? 'portrait' : 'landscape';

    // Ambil koordinat elemen yang dilaraskan
    const styleLogo = dapatkanGayaPosisi("dragLogoArea");
    const styleJenis = dapatkanGayaPosisi("dragJenis");
    const styleSub = dapatkanGayaPosisi("dragSub");
    const styleNama = dapatkanGayaPosisi("dragNama");
    const styleUlasan = dapatkanGayaPosisi("dragUlasan");
    const styleTandatangan = dapatkanGayaPosisi("dragTandatangan");

    let logoHtmlString = "<span style='font-size: 40px;'>🏆</span>";
    if (senaraiLogoBase64.length > 0) {
        logoHtmlString = senaraiLogoBase64.map(logoSrc => `<img src="${logoSrc}" style="height: 60px; object-fit: contain; margin: 0 9px;" />`).join("");
    }

    const tempContainer = document.getElementById("temp-output-container");
    tempContainer.innerHTML = ""; 

    senaraiNama.forEach((nama, index) => {
        const uniquePageId = `sijil-page-${index}`;
        
        const templateHtml = `
            <div class="sijil-container ${activeTheme} ${orientasiSijil}" id="${uniquePageId}" style="page-break-after: always; width: ${dimensiPDF[0]}px; height: ${dimensiPDF[1]}px; padding: 40px; background: #ffffff; position: relative; box-sizing: border-box; user-select: none;">
                <div class="sijil-inner" style="height: 100%; width: 100%; padding: 25px; position: relative; box-sizing: border-box;">
                    
                    <!-- Logos -->
                    <div style="position: absolute; display: flex; justify-content: center; align-items: center; ${styleLogo ? styleLogo : (isPortrait ? 'top: 50px; left: 50%; transform: translateX(-50%);' : 'top: 30px; left: 50%; transform: translateX(-50%);')}">
                        ${logoHtmlString}
                    </div>

                    <!-- Tajuk Jenis -->
                    <div style="position: absolute; text-align: center; ${styleJenis ? styleJenis : (isPortrait ? 'top: 170px; left: 50%; transform: translateX(-50%); width: 85%;' : 'top: 125px; left: 50%; transform: translateX(-50%); width: 80%;')}">
                        <div class="sijil-tajuk" style="font-family: 'Cinzel', serif, Georgia; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px;">${jenisSijilAkhir}</div>
                    </div>

                    <!-- Subtitle -->
                    <div style="position: absolute; text-align: center; ${styleSub ? styleSub : (isPortrait ? 'top: 250px; left: 50%; transform: translateX(-50%); width: 85%;' : 'top: 185px; left: 50%; transform: translateX(-50%); width: 80%;')}">
                        <div style="font-family: 'Montserrat', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 4px; color: #d4af37; font-weight: 700;">Dengan ini dianugerahkan kepada</div>
                    </div>

                    <!-- Penerima -->
                    <div style="position: absolute; text-align: center; ${styleNama ? styleNama : (isPortrait ? 'top: 310px; left: 50%; transform: translateX(-50%); width: 90%;' : 'top: 220px; left: 50%; transform: translateX(-50%); width: 90%;')}">
                        <div style="font-family: 'Playfair Display', serif, 'Times New Roman'; font-size: 28px; color: #0f172a; border-bottom: 2.5px solid #d4af37; display: inline-block; padding-bottom: 5px; font-weight: 700; font-style: italic;">${nama}</div>
                    </div>

                    <!-- Ulasan -->
                    <div style="position: absolute; text-align: center; ${styleUlasan ? styleUlasan : (isPortrait ? 'top: 420px; left: 50%; transform: translateX(-50%); width: 85%;' : 'top: 300px; left: 50%; transform: translateX(-50%); width: 80%;')}">
                        <div style="font-family: 'Montserrat', sans-serif; font-size: 13.5px; line-height: 1.7; color: #334155;">
                            di atas sumbangan, komitmen dan kecemerlangan yang telah ditunjukkan sepanjang menyertai <strong>${acara}</strong>. Terima kasih atas usaha murni yang diberikan.
                        </div>
                    </div>

                    <!-- Tandatangan -->
                    <div style="position: absolute; text-align: center; ${styleTandatangan ? styleTandatangan : (isPortrait ? 'bottom: 70px; left: 50%; transform: translateX(-50%); width: 70%;' : 'bottom: 45px; left: 50%; transform: translateX(-50%); width: 60%;')}">
                        <div style="font-family: 'Montserrat', sans-serif; font-weight: 700; border-top: 1.5px solid #94a3b8; display: inline-block; padding-top: 6px; width: 230px; font-size: 13.5px; color: #0f172a; text-transform: uppercase; text-align: center;">${guru}</div>
                        <div style="font-family: 'Montserrat', sans-serif; font-size: 11.5px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; text-align: center;">${jawatan}</div>
                    </div>

                </div>
            </div>
        `;
        tempContainer.innerHTML += templateHtml;
    });

    const opt = {
        margin:       0,
        filename:     `Sijil_A4_${orientasiPDF}_${jenisSijilAkhir.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'px', format: dimensiPDF, orientation: orientasiPDF } // Melaraskan orientasi PDF dinamik
    };

    alert(`Sedang menjana ${senaraiNama.length} keping PDF bersaiz A4 (${orientasiPDF.toUpperCase()})... Sila tunggu.`);

    html2pdf().set(opt).from(tempContainer).save().then(() => {
        tempContainer.innerHTML = ""; // Bersihkan semula kontena tersembunyi
    });
}

// Jalankan fungsi asas sebaik sahaja halaman dimuatkan
document.addEventListener("DOMContentLoaded", () => {
    kemaskiniPratinjau();
    aktifkanSistemDrag();
    tukarOrientasi(); // Set kedudukan asal pertama kali mengikut input radio lalai
});
