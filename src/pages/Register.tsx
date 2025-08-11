import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/profile-setup");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-green-100 to-white overflow-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Daftar</h2>
        {error && <p className="text-red-600 text-sm mb-6 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            required
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Daftar
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-700">
          Sudah punya akun?{" "}
          <Link to="/" className="text-green-600 hover:text-green-800 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
