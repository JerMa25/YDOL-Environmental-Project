"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/src/services/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await auth.login(formData.email, formData.password);
      if (response && response.token) {
        // Redirection basée sur le rôle
        if (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (response.role === 'ROLE_DRIVER' || response.role === 'DRIVER') {
          router.push('/dashboard'); // Ou une page spécifique chauffeur
        } else {
          router.push('/client');
        }
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-green-50">
      {/* SECTION FORMULAIRE */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="text-green-600 font-medium mb-6 inline-block hover:underline"
          >
            ← Retour à l'accueil
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Bon retour 👋
            </h1>

            <p className="text-gray-500 mb-6">
              Connectez-vous pour accéder à votre tableau de bord.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Se souvenir
                </label>

                <Link
                  href="/forgottenPassword"
                  className="text-green-600 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? "Chargement..." : "Se connecter"}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6">
              Pas encore de compte ?
              <Link
                href="/inscription"
                className="text-green-600 ml-2 font-semibold hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION IMAGE */}
      <div className="hidden lg:flex items-center justify-center bg-green-600 p-12">
        <div className="text-center">
          <img
            src="/assets/login-image.jpeg"
            alt="Waste tracker"
            className="w-100 mx-auto rounded-xl mb-8 shadow-lg"
          />
          <h2 className="text-3xl font-bold text-white mb-4">
            Gérez vos collectes facilement
          </h2>
          <p className="text-gray-300 max-w-md">
            Accédez à votre espace personnel pour suivre les collectes,
            recevoir les notifications et participer à un environnement plus propre.
          </p>
        </div>
      </div>
    </div>
  );
}