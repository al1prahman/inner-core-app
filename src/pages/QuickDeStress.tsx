import { useState } from "react";
import { Link } from "react-router-dom";

interface Stretch {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
}

interface AudioTrack {
  id: number;
  title: string;
  fileUrl: string;
  imageUrl?: string;
}

const stretches: Stretch[] = [
  {
    id: 1,
    name: "Mountain Pose",
    description: "Berdiri tegak dengan kaki rapat, tarik napas dalam, rasakan kestabilan tubuh.",
    imageUrl: "/yoga/mountain-pose.jpg",
    videoUrl: "https://www.youtube.com/embed/2HTvZp5rPrg"
  },
  {
    id: 2,
    name: "Child Pose",
    description: "Duduk dengan lutut terbuka, turunkan badan ke depan dan rilekskan bahu.",
    imageUrl: "/yoga/child-pose.jpg",
    videoUrl: "https://www.youtube.com/embed/2MjFCE0O1kk"
  },
  {
    id: 3,
    name: "Cat-Cow Stretch",
    description: "Posisi merangkak, lengkungkan punggung lalu turunkan perlahan.",
    imageUrl: "/yoga/cat-cow.jpg",
    videoUrl: "https://www.youtube.com/embed/kqnua4rHVVA"
  },
  {
    id: 4,
    name: "Seated Twist",
    description: "Duduk tegak, putar tubuh ke sisi kiri dan kanan secara perlahan.",
    imageUrl: "/yoga/seated-twist.jpg",
    videoUrl: "https://www.youtube.com/embed/lzRkeMuwl0s"
  },
  {
    id: 5,
    name: "Downward Dog",
    description: "Bentuk tubuh seperti segitiga terbalik, tumit mendekat ke lantai.",
    imageUrl: "/yoga/downward-dog.jpg",
    videoUrl: "https://www.youtube.com/embed/0FxItjCzxks"
  }
];

const audioTracks: AudioTrack[] = [
  {
    id: 1,
    title: "Aylex-meditation",
    fileUrl: "/audio/Aylex-Meditation.mp3",
    imageUrl: "/images/relax/relax-1.jpeg",
  },
  {
    id: 2,
    title: "Pufino-Thoughtful",
    fileUrl: "/audio/Pufino-Thoughtful.mp3",
    imageUrl: "/images/relax/relax-2.jpeg",
  },
  {
    id: 3,
    title: "Yellow-flower",
    fileUrl: "/audio/Yellow-flower.mp3",
    imageUrl: "/images/relax/relax-3.jpeg",
  },
];

export default function QuickDeStress() {
  const [mode, setMode] = useState<"menu" | "stretch" | "audio">("menu");
  const [selectedStretch, setSelectedStretch] = useState<Stretch | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
  <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8 min-h-[calc(100vh-3rem)]">

        {/* Menu Utama */}
        {mode === "menu" && (
          <div className="space-y-6 md:space-y-8 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Quick De-Stress</h1>
            <p className="text-gray-800 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
              Pilih aktivitas untuk membantumu rileks dan mengurangi stres.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-8 max-w-4xl mx-auto">
              <button
                onClick={() => setMode("stretch")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 md:py-6 px-6 md:px-8 rounded-lg hover:shadow-lg hover:scale-105 transition font-semibold text-base md:text-lg lg:text-xl"
              >
                🧘 Yoga & Stretching
              </button>
              <button
                onClick={() => setMode("audio")}
                className="bg-green-600 hover:bg-green-700 text-white py-4 md:py-6 px-6 md:px-8 rounded-lg hover:shadow-lg hover:scale-105 transition font-semibold text-base md:text-lg lg:text-xl"
              >
                🎧 Audio Relaksasi
              </button>
            </div>
            <div className="mt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-gray-900 text-white px-3 py-2 rounded-md shadow hover:bg-gray-800 transition text-sm"
                aria-label="Kembali ke Dashboard"
              >
                ← Kembali ke Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Yoga & Stretching */}
        {mode === "stretch" && (
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Pilih Gerakan</h2>
            {selectedStretch ? (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 text-gray-900">{selectedStretch.name}</h3>
                <p className="text-gray-800 mb-4 md:mb-6 text-sm md:text-base lg:text-lg">{selectedStretch.description}</p>
                <div className="aspect-video mb-4 md:mb-6 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedStretch.videoUrl}
                    title={selectedStretch.name}
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <button
                  onClick={() => setSelectedStretch(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:shadow-md transition font-medium text-sm md:text-base"
                >
                  ← Kembali ke daftar gerakan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stretches.map((s) => (
                  <div
                    key={s.id}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 md:p-6 rounded-lg shadow-sm cursor-pointer transition-colors"
                    onClick={() => setSelectedStretch(s)}
                  >
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="w-full h-32 md:h-40 object-cover rounded-md mb-3"
                    />
                    <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{s.name}</h4>
                    <p className="text-xs md:text-sm text-gray-800">{s.description}</p>
                  </div>
                ))}
                <div className="col-span-full mt-4 md:mt-6">
                  <button
                    onClick={() => setMode("menu")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:shadow-md transition font-medium text-sm md:text-base"
                  >
                    ← Kembali
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audio Relaksasi */}
        {mode === "audio" && (
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 md:mb-6">Audio Relaksasi</h2>
            <p className="text-gray-800 mb-6 md:mb-8 text-sm md:text-base lg:text-lg">
              Pilih audio untuk membantu menenangkan pikiranmu.
            </p>
            <div className="space-y-4 md:space-y-6">
              {audioTracks.map((audio) => (
                <div
                  key={audio.id}
                  className="bg-white border border-green-300 p-4 md:p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-3 md:mb-4 text-gray-900 text-base md:text-lg">{audio.title}</h3>
                  {audio.imageUrl && (
                    <div className="aspect-video rounded-md overflow-hidden mb-3 md:mb-4">
                      <img
                        src={audio.imageUrl}
                        alt={`Gambar untuk ${audio.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <audio controls className="w-full">
                    <source src={audio.fileUrl} type="audio/mpeg" />
                    Browser kamu tidak mendukung audio tag.
                  </audio>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMode("menu")}
              className="mt-6 md:mt-8 bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:shadow-md transition font-medium text-sm md:text-base"
            >
              ← Kembali
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
