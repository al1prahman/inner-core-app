// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [assessment, setAssessment] = useState<{ percent: number; status: string; color: string } | null>(null);
  const [weeklySeries, setWeeklySeries] = useState<{ label: string; percent: number; dateMs: number }[]>([]);

  const colorMap: Record<string, string> = {
    red: "#EF4444",
    orange: "#F97316",
    yellow: "#FACC15",
    green: "#22C55E",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
  const user = auth.currentUser;
  if (!user) return navigate("/");

        // Ambil semua data sekaligus biar cepat
        const [userDoc, assessDoc, weeklySnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "assessments", user.uid)),
          getDocs(collection(db, "weekly_reviews", user.uid, "weeks"))
        ]);

        // Profile
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({ name: data.name ?? data.nama ?? "Pengguna" });
        }

        // Assessment
        if (assessDoc.exists()) {
          const { percent, status, color } = assessDoc.data();
          setAssessment({ percent, status, color });
        }

        // Weekly data (sorted by date)
        const weeks: { label: string; percent: number; dateMs: number }[] = [];
        weeklySnap.forEach(s => {
          const data = s.data();
          const percent = Number(data.percent ?? 0);
          const date = data.date?.toDate ? data.date.toDate() : new Date(data.date ?? Date.now());
          weeks.push({ label: "", percent, dateMs: date.getTime() });
        });
        weeks.sort((a, b) => a.dateMs - b.dateMs);
        // assign week labels after sort
        weeks.forEach((w, idx) => (w.label = `Minggu ${idx + 1}`));
        setWeeklySeries(weeks);

      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <div className="text-center animate-pulse">
          <div className="text-lg md:text-2xl font-semibold text-gray-800">Memuat dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Integrate weekly trend into assessment pie: if weekly improves (delta>0), gejala percent goes down
  const basePercent = assessment?.percent ?? 0;
  const trendN = Math.min(4, Math.max(0, weeklySeries.length));
  const trendStart = trendN ? weeklySeries[weeklySeries.length - trendN]?.percent ?? basePercent : basePercent;
  const trendLast = trendN ? weeklySeries[weeklySeries.length - 1]?.percent ?? basePercent : basePercent;
  const trendDelta = trendLast - trendStart; // improvement positive
  const adjustedPercent = Math.max(0, Math.min(100, basePercent - trendDelta));

  const pieData = assessment
    ? [
        { name: "Gejala Negatif", value: adjustedPercent },
        { name: "Remainder", value: Math.max(0, 100 - adjustedPercent) },
      ]
    : [];

  const chartColor = assessment ? colorMap[assessment.color] || "#8884d8" : "#ddd";
  const initial = (userData?.name?.trim()?.charAt(0) || "P").toUpperCase();
  // For Weekly Progress UI: show a placeholder 0%-series if there's no data yet
  const hasWeekly = weeklySeries.length > 0;
  const fallbackSeries: { label: string; percent: number; dateMs: number }[] = Array.from({ length: 4 }, (_, i) => ({
    label: `Minggu ${i + 1}`,
    percent: 0,
    dateMs: Date.now() + i,
  }));
  const displaySeries = hasWeekly ? weeklySeries : fallbackSeries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex justify-center items-center">
      <div className="w-full mx-auto px-4 md:px-8 py-8" style={{maxWidth: '1440px'}}>
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-8 min-h-[80vh] flex flex-col justify-center" style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Selamat datang, {userData?.name} 👋
          </h1>

          {/* Profil (dipindah di atas Pie Chart) */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6 max-w-sm mx-auto flex flex-col items-center">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                aria-label="Buka Profil"
                title="Profil"
              >
                <span className="text-lg font-bold">{initial}</span>
              </button>
              <p className="mt-2 text-base md:text-lg font-semibold text-gray-900 text-center">Profil Anda</p>
            </div>
          </div>

          {/* Assessment (Pie Chart) */}
      {assessment && (
            <div className="my-8 bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-900">Hasil Evaluasi Awal</h2>
              <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-8">
                <div className="mx-auto">
                  <ResponsiveContainer width={260} height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={false}
                      >
                        <Cell fill={chartColor} />
                        <Cell fill="transparent" stroke="transparent" />
                      </Pie>
                      <Tooltip formatter={(v: any) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 w-full">
                  <div className="h-full rounded-lg border border-gray-200 bg-gray-50 p-4 flex flex-col justify-center">
                    <p className="text-sm text-gray-700 mb-1">Persentase Gejala</p>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-extrabold text-gray-900">{Math.round(adjustedPercent)}%</span>
                      {(() => {
                        const n = Math.min(4, Math.max(1, weeklySeries.length));
                        const start = weeklySeries.length ? (weeklySeries[weeklySeries.length - n]?.percent ?? 0) : 0;
                        const last = weeklySeries.length ? (weeklySeries[weeklySeries.length - 1]?.percent ?? 0) : 0;
                        const delta = last - start;
                        const sign = delta > 0 ? "+" : "";
                        const color = delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-gray-600";
                        return (
                          <span className={`text-sm font-semibold ${color}`}>Last {n} Weeks {sign}{delta}%</span>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: chartColor }} />
                      <span>Lebih kecil lebih baik</span>
                    </div>
                    <div className="mt-3 text-gray-800">
                      <span className="font-semibold">Status:</span> {assessment.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          

          {/* Menu Fitur */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="bg-indigo-600 text-white py-3 rounded-lg" onClick={() => navigate("/de-stress")}>
              🧘 Quick De-Stress
            </button>
            <button className="bg-green-600 text-white py-3 rounded-lg" onClick={() => navigate("/sleep-tracker")}>
              🛌 Sleep Tracker
            </button>
            <button className="bg-yellow-600 text-white py-3 rounded-lg" onClick={() => navigate("/challenge-box")}>
              🎯 Challenge Box
            </button>
            <button className="bg-purple-600 text-white py-3 rounded-lg" onClick={() => navigate("/weekly-review")}>
              📊 Weekly Review
            </button>
            <button className="bg-pink-600 text-white py-3 rounded-lg" onClick={() => navigate("/self-care")}>
              📅 Self-Care Planner
            </button>
          </div>

          {/* Progress Mingguan (dipindah di bawah Menu Fitur) */}
          <div className="my-8">
            <h2 className="text-xl font-semibold text-center mb-4 text-black">Progres Mingguan</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 md:p-6">
              <div className="mb-3">
                <p className="text-sm text-gray-700">Mental Health Score Over Time</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{displaySeries[displaySeries.length - 1].percent}</span>
                  {(() => {
                    const n = Math.min(4, displaySeries.length);
                    const start = displaySeries[displaySeries.length - n]?.percent ?? 0;
                    const last = displaySeries[displaySeries.length - 1]?.percent ?? 0;
                    const delta = last - start;
                    const sign = delta > 0 ? "+" : "";
                    const color = delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-gray-600";
                    return (
                      <span className={`text-sm font-semibold ${color}`}>Last {n} Weeks {sign}{delta}%</span>
                    );
                  })()}
                </div>
              </div>
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displaySeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#374151', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#374151', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <Tooltip formatter={(v: any) => `${v}%`} />
                    <Area type="monotone" dataKey="percent" stroke="#6b7280" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {!hasWeekly && (
                <p className="mt-2 text-xs text-gray-500 text-center">Mulailah dengan mengisi Weekly Review pertama Anda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
