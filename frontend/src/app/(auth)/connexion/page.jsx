"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
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

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Nom d'utilisateur ou email"
                value={formData.email}
                onChange={handleChange}
                className="input-style"
                required
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />

              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="input-style"
                required
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />

              <div className="flex justify-between text-sm">

                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox"/>
                  Se souvenir
                </label>

                <Link
                  href="/forgot-password"
                  className="text-green-600 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>

              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Se connecter
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