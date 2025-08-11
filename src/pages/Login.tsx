import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mapAuthError = (code: string, message: string) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Email atau kata sandi salah.";
      case "auth/user-not-found":
        return "Akun tidak ditemukan. Periksa email Anda atau daftar terlebih dahulu.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Coba lagi nanti.";
      case "auth/network-request-failed":
        return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      case "auth/missing-password":
        return "Kata sandi wajib diisi.";
      default:
        return message || "Terjadi kesalahan saat masuk.";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile-setup");
    } catch (err: any) {
      const code = err?.code as string;
      const message = err?.message as string;
      setError(mapAuthError(code, message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-100 to-white overflow-auto px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-[2px] rounded-2xl shadow-xl">
          <div className="bg-white p-8 rounded-[14px] border border-white/60">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
              Inner-Core
            </h1>
            <p className="text-sm text-center text-gray-600 mb-6 italic">Strength Starts from Within</p>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
        {error && (
          <p role="alert" className="text-red-600 text-sm mb-6 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 shadow-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition font-semibold text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"}`}
          >
            {submitting ? "Memproses..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-700">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
            Daftar
          </Link>
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}
