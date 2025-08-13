import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface SleepRecord {
  id: string;
  sleepTime: string;
  wakeTime: string;
  duration: number;
  quality: string;
  date: string;
  dateMs: number;
}

export default function SleepTracker() {
  const navigate = useNavigate();
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const t = new Date();
    return t.toISOString().slice(0, 10); // yyyy-mm-dd
  });
  const [, setRecords] = useState<SleepRecord[]>([]);
  const [, setLoading] = useState(true);
  const [sleepPercent, setSleepPercent] = useState<number>(0);
  const [feedback, setFeedback] = useState("Belum ada data tidur");
  const [feedbackEmoji, setFeedbackEmoji] = useState("🛌");
  const [uid, setUid] = useState<string | null>(null);

  const calculateQuality = (sleep: string, wake: string, dateStr: string) => {
    const [sh, sm] = sleep.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    const [y, m, d] = dateStr.split("-").map(Number);

    const base = new Date(y, m - 1, d);
    const sleepDate = new Date(base);
    sleepDate.setHours(sh, sm, 0, 0);

    const wakeDate = new Date(base);
    wakeDate.setHours(wh, wm, 0, 0);

    if (wakeDate <= sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);

    const duration = (wakeDate.getTime() - sleepDate.getTime()) / 36e5;
    const isGood = duration >= 7 && duration <= 9;
    return { duration, quality: isGood ? "Baik" : "Buruk", baseDate: base };
  };

  const fetchRecords = async (userUid: string) => {
    setLoading(true);
    try {
      const q = collection(db, "sleep-tracker", userUid, "records");
      const snap = await getDocs(q);
      const data: SleepRecord[] = [];

      snap.forEach((docSnap) => {
        const rec = docSnap.data() as any;
        if (!rec.sleepTime || !rec.wakeTime || typeof rec.duration !== "number") return;
        const d = rec.createdAt?.toDate?.() || new Date();
        data.push({
          id: docSnap.id,
          sleepTime: rec.sleepTime,
          wakeTime: rec.wakeTime,
          duration: rec.duration,
          quality: rec.quality,
          date: d.toLocaleDateString(),
          dateMs: d.getTime(),
        });
      });

      data.sort((a, b) => b.dateMs - a.dateMs);
      setRecords(data);

      if (data.length > 0) {
        const latest = data[0];
        const percent = Math.min((latest.duration / 8) * 100, 100);
        setSleepPercent(percent);
        if (latest.duration >= 7 && latest.duration <= 9) {
          setFeedbackEmoji("😴");
          setFeedback("Tidur kamu cukup, pertahankan kebiasaan baik ini!");
        } else if (latest.duration < 7) {
          setFeedbackEmoji("😕");
          setFeedback("Tidur kamu kurang, coba besok tidur lebih awal.");
        } else {
          setFeedbackEmoji("💤");
          setFeedback("Tidur kamu berlebihan, coba tidur secukupnya saja.");
        }
      }
    } catch (err) {
      console.error("Gagal ambil data tidur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!uid || !sleepTime || !wakeTime) return;
    const { duration, quality, baseDate } = calculateQuality(sleepTime, wakeTime, selectedDate);
    const percent = Math.min((duration / 8) * 100, 100);
    setSleepPercent(percent);

    if (duration >= 7 && duration <= 9) {
      setFeedbackEmoji("😴");
      setFeedback("Tidur kamu cukup, pertahankan kebiasaan baik ini!");
    } else if (duration < 7) {
      setFeedbackEmoji("😕");
      setFeedback("Tidur kamu kurang, coba besok tidur lebih awal.");
    } else {
      setFeedbackEmoji("💤");
      setFeedback("Tidur kamu berlebihan, coba tidur secukupnya saja.");
    }

    await addDoc(collection(db, "sleep-tracker", uid, "records"), {
      sleepTime,
      wakeTime,
      duration,
      quality,
      createdAt: Timestamp.fromDate(baseDate),
    });

    fetchRecords(uid);
    setSleepTime("");
    setWakeTime("");
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        fetchRecords(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="h-screen bg-gradient-to-b from-green-50 to-white p-6 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-6"
        >
          ← Kembali ke Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-8">Sleep Tracker</h1>

        {/* Input */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border px-4 py-3 rounded-lg" />
          <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} className="border px-4 py-3 rounded-lg" />
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="border px-4 py-3 rounded-lg" />
        </div>

        <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg">Simpan</button>

        {/* Progress Ring */}
        <div className="mt-8 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle cx="48" cy="48" r="45" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="#22c55e"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - sleepPercent / 100)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold">{sleepPercent.toFixed(0)}%</div>
          </div>
          <div className="text-4xl mt-2">{feedbackEmoji}</div>
          <p className="mt-2">{feedback}</p>
        </div>

        {/* Motivational Tips */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Tips untuk Kualitas Tidur Lebih Baik</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Pastikan untuk tidur dan bangun pada jam yang sama setiap hari.</li>
          <li>Hindari penggunaan gadget atau layar biru setidaknya 1 jam sebelum tidur.</li>
          <li>Ciptakan suasana kamar yang nyaman, gelap, dan tenang.</li>
          <li>Hindari konsumsi kafein atau makanan berat menjelang waktu tidur.</li>
          <li>Lakukan relaksasi seperti meditasi atau membaca buku sebelum tidur.</li>
        </ul>
      </div>
    </div>
  );
}
