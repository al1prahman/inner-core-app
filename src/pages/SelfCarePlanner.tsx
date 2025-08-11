import { Link } from "react-router-dom";

export default function SelfCarePlanner() {
  return (
    <div className="h-screen bg-gradient-to-b from-pink-100 to-white p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 min-h-[calc(100vh-3rem)] flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          📅 Self-Care Planner
        </h1>
        <p className="text-center text-gray-800 mb-8 text-lg">
          Unduh template kalender mini "Self-Care Challenge 7 Days" dan isi sesuai targetmu.
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href="/pdfs/Self-care%20Challange%207%20Day%27s.pdf"
            download="Self-care-Challange-7-Day's.pdf"
            className="bg-pink-600 hover:bg-pink-700 text-white py-4 px-8 rounded-lg shadow-lg transition font-semibold text-lg"
          >
            📥 Download Self-Care Challenge (PDF)
          </a>
          <Link
            to="/dashboard"
            className="inline-flex items-center bg-gray-900 text-white px-3 py-2 rounded-md shadow hover:bg-gray-800 transition text-sm"
            aria-label="Kembali ke Dashboard"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Tips Penggunaan */}
        <div className="mt-8 p-6 bg-pink-50 border border-pink-200 rounded-lg text-gray-900">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">💡 Tips Penggunaan Self‑Care Planner</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-gray-800">
            <li>Tentukan fokus mingguan (misalnya: tidur cukup, hidrasi, gerak 20 menit, journaling).</li>
            <li>Jadikan checklist harian: beri tanda centang setiap tugas selesai agar kemajuan terlihat.</li>
            <li>Tulis target yang spesifik dan realistis (SMART) agar mudah diikuti.</li>
            <li>Jadwalkan waktu tetap (pagi/siang/malam) dan setel pengingat di ponsel.</li>
            <li>Gunakan warna atau stiker untuk membedakan kategori (fisik, mental, sosial).</li>
            <li>Lakukan review singkat di akhir minggu: apa yang berhasil, apa yang perlu disederhanakan.</li>
            <li>Bagikan rencana dengan teman/keluarga agar ada dukungan dan akuntabilitas.</li>
          </ul>
          <div className="mt-4 text-sm md:text-base text-gray-700">
            <p>
              Print out: ukuran A4, kertas 80–100 gsm. Tempel di meja belajar/kerja, dinding kamar,
              atau masukkan ke binder/clipboard. Simpan juga versi digital untuk dicetak ulang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
