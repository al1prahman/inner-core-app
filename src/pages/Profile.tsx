import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
  name: string;
  age: number | string;
  job: string;
  gender: string;
  email: string;
  } | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          // Prefer ProfileSetup keys, fallback to older keys if present
          name: data.name ?? data.nama ?? "",
          age: data.age ?? data.umur ?? "",
          job: data.job ?? data.pekerjaan ?? "",
          gender: data.gender ?? "",
          email: user.email || "",
        });
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
  await signOut(auth); // ✅ reset auth
  navigate("/", { replace: true }); // ✅ redirect to login route
    } catch (error) {
      console.error("Gagal logout:", error);
      setSigningOut(false);
    }
  };

  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <div className="text-center text-2xl font-semibold text-gray-900">Memuat profil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-6 px-4 md:px-6 lg:px-8 flex justify-center items-center overflow-auto">
      <div className="container mx-auto max-w-lg">
        <div className="w-full bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            Profil Pengguna
          </h1>

          <div className="space-y-4 mb-6 md:mb-8">
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900"><strong>Nama:</strong> {userData.name}</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900"><strong>Email:</strong> {userData.email}</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900"><strong>Umur:</strong> {userData.age}</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900"><strong>Pekerjaan:</strong> {userData.job}</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-gray-900"><strong>Gender:</strong> {userData.gender}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg transition font-semibold"
            >
              ⬅ Kembali ke Dashboard
            </button>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className={`bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition font-semibold ${signingOut ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {signingOut ? "Memproses..." : "🚪 Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
