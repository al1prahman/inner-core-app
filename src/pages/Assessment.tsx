// src/pages/Assessment.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Assessment() {
  const navigate = useNavigate();

  const questions = [
    "Saya merasa sulit berkonsentrasi pada pelajaran atau pekerjaan.",
    "Saya merasa cemas atau gelisah hampir setiap hari.",
    "Saya merasa kesepian meskipun berada di antara banyak orang.",
    "Saya mengalami kesulitan tidur atau sering terbangun di malam hari.",
    "Saya merasa lelah meskipun tidak melakukan aktivitas berat.",
    "Saya kehilangan minat pada aktivitas yang biasanya saya sukai.",
    "Saya merasa tertekan dengan tuntutan akademik.",
    "Saya kesulitan mengatur waktu untuk belajar dan beristirahat.",
    "Saya jarang berolahraga atau melakukan aktivitas fisik.",
    "Saya sering merasa malas untuk bergerak atau beraktivitas.",
    "Saya merasa mudah marah atau tersinggung.",
    "Saya merasa tidak percaya diri dengan kemampuan saya.",
    "Saya mengalami perubahan pola makan (lebih banyak atau lebih sedikit).",
    "Saya sering merasa kewalahan dengan banyaknya tugas.",
    "Saya jarang meluangkan waktu untuk diri sendiri dan relaksasi.",
  ];

  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Cek apakah sudah pernah isi sebelumnya
    const docRef = doc(db, "assessments", user.uid);
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      alert("Anda sudah pernah mengisi assessment ini.");
      navigate("/dashboard");
      return;
    }

    const totalScore = answers.reduce((a, b) => a + b, 0);
    const percent = Math.round((totalScore / (questions.length * 4)) * 100);

    let status = "";
    let color = "";
    let motivation = "";

    if (percent <= 25) {
      status = "Sehat";
      color = "green";
      motivation = "Kondisi mental Anda baik, pertahankan pola hidup sehat!";
    } else if (percent <= 50) {
      status = "Cukup";
      color = "yellow";
      motivation = "Perlu sedikit perhatian pada kesehatan mental Anda.";
    } else if (percent <= 75) {
      status = "Kurang Baik";
      color = "orange";
      motivation = "Mulailah mengatur waktu dan beristirahat dengan cukup.";
    } else {
      status = "Buruk";
      color = "red";
      motivation = "Segera cari bantuan atau ceritakan pada orang yang Anda percaya.";
    }

    // Simpan hasil ke Firestore
    await setDoc(docRef, {
      scoreData: [
        { name: "Gejala Negatif", value: percent },
        { name: "Kondisi Positif", value: 100 - percent },
      ],
      percent,
      status,
      color,
      date: new Date(),
    });

  setScore(percent);
  setSubmitted(true); // trigger in-page modal
  };
  

  return (
    <div className="h-screen bg-gradient-to-b from-blue-100 to-white py-6 px-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Assessment Kesehatan Mental & Aktivitas Fisik
        </h1>
        <p className="text-center text-sm text-gray-700 -mt-6 mb-8">
          Skala jawaban (0–4): 0 = Tidak Pernah, 1 = Jarang, 2 = Kadang-kadang, 3 = Sering, 4 = Sangat Sering
        </p>
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="mb-4 text-gray-900 font-medium text-lg">{i + 1}. {q}</p>
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
                        `px-4 py-2 rounded-lg border font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition ` +
                        (selected
                          ? `bg-blue-600 text-white border-blue-600`
                          : `bg-white text-gray-900 border-gray-300 hover:bg-blue-50`)
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg transition font-semibold text-lg"
          >
            Simpan Hasil
          </button>
        </div>
      </div>
      {/* Modal hasil (in-page) */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hasil Assessment Anda</h2>
            {(() => {
              let emoji = "😊";
              let message = "";
              if (score <= 25) {
                emoji = "🟢😃";
                message = "Kondisi mental Anda baik! Tetap pertahankan kebiasaan positif dan semangat! 🎉";
              } else if (score <= 50) {
                emoji = "🟡🙂";
                message = "Perlu sedikit perhatian pada kesehatan mental Anda. Jangan lupa istirahat dan lakukan hal yang Anda sukai! 🌱";
              } else if (score <= 75) {
                emoji = "🟠😕";
                message = "Mulailah mengatur waktu dan beristirahat dengan cukup. Coba lakukan aktivitas fisik ringan atau ngobrol dengan teman! 💪";
              } else {
                emoji = "🔴😢";
                message = "Segera cari bantuan atau ceritakan pada orang yang Anda percaya. Anda tidak sendiri! 🤗";
              }
              return (
                <>
                  <div className="text-6xl mb-3">{emoji}</div>
                  <p className="text-xl text-gray-800 mb-1">
                    Skor: <span className="font-bold text-blue-600">{score}%</span>
                  </p>
                  <p className="text-gray-700 mb-5">{message}</p>
                </>
              );
            })()}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
