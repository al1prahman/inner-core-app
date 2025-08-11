// src/pages/WeeklyReview.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export default function WeeklyReview() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [showModal, setShowModal] = useState(false);
  const [savedPercent, setSavedPercent] = useState<number | null>(null);

  const questions = [
    "Saya merasa lebih tenang dibanding minggu lalu.",
    "Saya dapat mengelola waktu lebih baik minggu ini.",
    "Saya berolahraga atau bergerak aktif setidaknya 3 kali minggu ini.",
    "Saya merasa tidur saya lebih berkualitas minggu ini.",
    "Saya meluangkan waktu untuk diri sendiri.",
    "Saya merasa stres akademik berkurang.",
    "Saya mencoba teknik relaksasi atau de-stress.",
    "Saya berinteraksi sosial dengan teman/keluarga.",
    "Saya mengurangi waktu layar/gadget untuk hal yang tidak penting.",
    "Saya merasa lebih bersemangat menjalani hari.",
  ];

  // Tetap butuh login, tapi tanpa pembatasan 7 hari
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) navigate("/");
  }, [navigate]);

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const totalScore = answers.reduce((a, b) => a + b, 0);
    const percent = Math.round((totalScore / (questions.length * 4)) * 100);

    await setDoc(doc(collection(db, "weekly_reviews", user.uid, "weeks")), {
      answers,
      percent,
      date: new Date(),
    });

  // Show in-page modal instead of browser alert
  setSavedPercent(percent);
  setShowModal(true);
  };

  // Selalu render form weekly review

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white py-6 md:py-10 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-900">
          Weekly Review - Evaluasi Mingguan
        </h1>
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="bg-white p-4 md:p-6 rounded-lg shadow">
              <p className="mb-3 md:mb-4 text-gray-900 text-sm md:text-base lg:text-lg font-medium">
                {i + 1}. {q}
              </p>
              <div className="flex gap-3 flex-wrap">
                {[0, 1, 2, 3, 4].map((val) => {
                  const selected = answers[i] === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswerChange(i, val)}
                      aria-pressed={selected}
                      className={
                        `px-4 py-2 rounded-lg border font-semibold text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition ` +
                        (selected
                          ? `bg-purple-600 text-white border-purple-600`
                          : `bg-white text-gray-900 border-gray-300 hover:bg-purple-50`)
                      }
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 md:py-4 rounded-lg hover:shadow-lg transition font-medium text-base md:text-lg"
          >
            Simpan Weekly Review
          </button>
          <div className="mt-4 flex justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-gray-900 text-white px-3 py-2 rounded-md shadow hover:bg-gray-800 transition text-sm"
              aria-label="Kembali ke Dashboard"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-[92%] max-w-md">
            <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 p-[2px] rounded-2xl shadow-2xl">
              <div className="bg-white rounded-[14px] p-6 md:p-7">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.29a.75.75 0 1 0-1.06-1.06l-3.97 3.97-1.53-1.53a.75.75 0 1 0-1.06 1.06l2.06 2.06c.293.293.767.293 1.06 0l4.5-4.5Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Weekly Review Tersimpan</h3>
                  {savedPercent !== null && (
                    <p className="mt-2 text-gray-800">
                      Skor minggu ini: <span className="font-semibold text-purple-700">{savedPercent}%</span>
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-600">Terima kasih, progresmu tercatat. Lanjutkan kebiasaan baikmu 🙌</p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Lihat Dashboard
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-white border border-gray-300 text-gray-900 py-2.5 rounded-lg hover:bg-gray-50 shadow-sm"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
