import { useState } from "react";
import { Link } from "react-router-dom";

const challenges = [
  "Lari 10 menit di sekitar kampus",
  "Lompat tali 50 kali",
  "Push up 15 kali",
  "Plank selama 1 menit",
  "Naik turun tangga 10 kali",
  "Jalan cepat keliling kampus selama 15 menit",
  "Squat 20 kali",
  "Yoga selama 10 menit",
  "Bersepeda 30 menit",
  "Membaca selama 30 menit",
  "Meditasi selama 10 menit",
];

export default function ChallengeBox() {
  const [challenge, setChallenge] = useState<string | null>(null);

  const getRandomChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setChallenge(challenges[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex flex-col items-center justify-center py-6 px-4 md:px-6 lg:px-8 overflow-auto">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3 text-gray-900">🎯 Challenge Box</h1>
          <p className="text-center text-sm md:text-base text-gray-800 mb-6 md:mb-8">
            Tekan tombol di bawah untuk mendapatkan tantangan acak yang bisa kamu lakukan hari ini.
            Tantangan berisi aktivitas fisik ringan dan kebiasaan sehat untuk menambah energi dan fokusmu.
          </p>

          <button
            onClick={getRandomChallenge}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 md:py-4 rounded-lg hover:shadow-lg hover:scale-105 transition mb-6 md:mb-8 font-semibold text-base md:text-lg"
          >
            Dapatkan Tantangan!
          </button>

          {challenge && (
            <div className="text-center p-4 md:p-6 border-2 border-orange-400 rounded-lg bg-orange-50 mb-6">
              <p className="text-base md:text-xl font-semibold text-gray-900">{challenge}</p>
            </div>
          )}

          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-gray-900 text-white px-3 py-2 rounded-md shadow hover:bg-gray-800 transition text-sm"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
