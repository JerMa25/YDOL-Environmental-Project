"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    lastName: "",
    firstName: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User data:", formData);
  };

  return (

    <div className="min-h-screen grid lg:grid-cols-2">

      {/* SECTION GAUCHE */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-linear-to-br from-green-500 to-green-700 text-white p-16">
        <img
          src="/assets/create-account-image.png"
          alt="Waste collection"
          className="w-105 mb-10 rounded-xl shadow-2xl"
        />

        <h2 className="text-4xl font-bold mb-6 text-center">
          Rejoignez Waste Tracker
        </h2>

        <p className="text-lg text-center max-w-md opacity-90 leading-relaxed">
          Recevez les notifications de collecte, signalez les bacs pleins
          et contribuez à garder votre ville propre grâce à une gestion
          intelligente des déchets.
        </p>

      </div>


      {/* SECTION FORMULAIRE */}
      <div className="flex items-center justify-center bg-green-50 p-8">

        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-green-600 font-medium mb-6 inline-block hover:underline"
          >
            ← Retour à l'accueil
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-10">

            <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
              Créer un compte
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-style"
                  required
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-style"
                  required
                />

              </div>

              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur ou de l'entreprise"
                value={formData.username}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={handleChange}
                className="input-style"
                required
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  name="city"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-style"
                  required
                />

                <input
                  type="text"
                  name="district"
                  placeholder="Quartier"
                  value={formData.district}
                  onChange={handleChange}
                  className="input-style"
                  required
                />

              </div>

              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="input-style"
                required
              />

              <input
                type="password"
                name="confirm_password"
                placeholder="Confirmer le mot de passe"
                value={formData.confirm_password}
                onChange={handleChange}
                className="input-style"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                S'inscrire
              </button>

            </form>

            <p className="text-center text-gray-500 mt-6">
              Vous avez déjà un compte ?
              <a href="/connexion" className="text-green-600 ml-2 font-semibold hover:underline">
                Se connecter
              </a>
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}