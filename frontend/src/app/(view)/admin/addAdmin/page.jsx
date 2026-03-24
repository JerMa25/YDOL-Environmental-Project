"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/src/components/layout/Modals/SuccessModal";
import ErrorModal from "@/src/components/layout/Modals/ErrorModal";
import ConfirmationModal from "@/src/components/layout/Modals/ConfirmationModal";
import { api } from "@/src/services/api";
import { Loader2 } from "lucide-react";

export default function AddAdmin() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", // Mapping to 'surname' in backend
    lastName: "",  // Mapping to 'name' in backend
    phone: "",
    email: "",
    password: "",
    site: "",
    city: "",
    role: "ADMIN",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    try {
      setLoading(true);
      const payload = {
        name: formData.lastName,
        surname: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        site: formData.site,
        role: formData.role
      };

      await api.post("/admins", payload);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating admin:", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 flex justify-center p-10 min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-10 h-fit">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Créer un nouvel administrateur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NOM */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Nom</label>
              <input
                type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: Tchapet"
              />
            </div>

            {/* PRENOM */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Prénom</label>
              <input
                type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: Rolain"
              />
            </div>

            {/* TEL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Téléphone</label>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: 690 123 456"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: r.tchapet@ydol.com"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* SITE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Site</label>
              <input
                type="text" name="site" value={formData.site} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: Akwa"
              />
            </div>

            {/* VILLE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Ville</label>
              <input
                type="text" name="city" value={formData.city} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: Douala"
              />
            </div>

            {/* ROLE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Rôle</label>
              <select
                name="role" value={formData.role} onChange={handleChange}
                className="border border-gray-200 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button" onClick={() => router.push("/admin/adminList")}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          message="Êtes-vous sûr de vouloir créer cet administrateur ?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          message="L'administrateur a été créé avec succès !"
          onClose={() => {
            setShowSuccess(false);
            router.push("/admin/adminList");
          }}
        />
      )}

      {showError && (
        <ErrorModal
          message="Une erreur est survenue lors de la création de l'administrateur. Veuillez vérifier que l'email n'est pas déjà utilisé."
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}