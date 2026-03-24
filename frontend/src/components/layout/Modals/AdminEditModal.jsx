"use client";

import { useState } from "react";
import { api } from "@/src/services/api";
import { Loader2, X } from "lucide-react";

export default function AdminEditModal({ admin, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...admin,
    firstName: admin.surname || "",
    lastName: admin.name || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const save = async () => {
    try {
      setLoading(true);
      const payload = {
        name: formData.lastName,
        surname: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        site: formData.site,
        role: formData.role || "ADMIN"
      };

      await api.put(`/admins/${admin.id}`, payload);
      onClose();
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Erreur lors de la mise à jour de l'administrateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-green-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Modifier l'administrateur</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</label>
              <input
                name="lastName" value={formData.lastName} onChange={handleChange}
                className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prénom</label>
              <input
                name="firstName" value={formData.firstName} onChange={handleChange}
                className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Téléphone</label>
            <input
              name="phone" value={formData.phone} onChange={handleChange}
              className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
            <input
              name="email" value={formData.email} onChange={handleChange} type="email"
              className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Site</label>
              <input
                name="site" value={formData.site} onChange={handleChange}
                className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</label>
              <select
                name="role" value={formData.role} onChange={handleChange}
                className="border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-green-500 outline-none transition bg-white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition font-bold text-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={save} disabled={loading}
            className="px-8 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold flex items-center gap-2 shadow-lg shadow-green-100"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}