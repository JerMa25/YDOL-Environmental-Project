"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/services/api";
import { Loader2, Trash2 } from "lucide-react";
import SuccessModal from "@/src/components/layout/Modals/SuccessModal";
import ErrorModal from "@/src/components/layout/Modals/ErrorModal";

export default function AddGarbageBin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    town: "",
    quarter: "",
    status: "AVAILABLE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        latitude: 0,
        longitude: 0,
      };
      await api.post("/bins", payload);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error creating bin:", err);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 w-full max-w-2xl h-fit">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-green-100 rounded-2xl text-green-600">
            <Trash2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ajouter un nouveau bac</h1>
            <p className="text-gray-500">Identifier et localiser un bac de collecte dans le système</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Code du bac</label>
              <input
                type="text" name="code" value={formData.code} onChange={handleChange} required
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: BAC-001"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Ville</label>
              <input
                type="text" name="town" value={formData.town} onChange={handleChange} required
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Douala"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Quartier</label>
              <input
                type="text" name="quarter" value={formData.quarter} onChange={handleChange} required
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Akwa"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Statut initial</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="FULL">Plein</option>
                <option value="MAINTENANCE">En maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button" onClick={() => router.back()}
              className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={loading}
              className="px-10 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold flex items-center gap-2 shadow-lg shadow-green-100"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Enregistrer le bac
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal
          message="Le bac a été ajouté avec succès au réseau."
          onClose={() => {
            setShowSuccess(false);
            router.push("/admin/garbageBinList");
          }}
        />
      )}

      {showError && (
        <ErrorModal
          message="Impossible d'ajouter le bac. Le code est déjà utilisé ou les données sont invalides."
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}