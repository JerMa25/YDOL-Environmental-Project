"use client";

import { useState } from "react";

export default function AdminEditModal({ admin, onClose }) {

  const [formData, setFormData] = useState(admin);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const save = () => {
    console.log("Admin updated:", formData);
    onClose();
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-8 w-full max-w-lg">

        <h2 className="text-xl font-bold mb-6">
          Modifier administrateur
        </h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-500">
              Nom complet
            </label>
            <input
              value={`${formData.name} ${formData.surname}`}
              readOnly
              className="border w-full rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Téléphone
            </label>
            <input
              value={formData.phone}
              readOnly
              className="border w-full rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              adresse email
            </label>
            <input
              value={formData.email}
              readOnly
              className="border w-full rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Site
            </label>
            <input
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="border w-full rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Ville
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border w-full rounded-lg px-3 py-2"
            />
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-red-500 hover:text-white border rounded-lg"
          >
            Annuler
          </button>

          <button
            onClick={save}
            className="px-4 py-2 hover:bg-green-700 bg-green-600 text-white rounded-lg"
          >
            Enregistrer
          </button>

        </div>

      </div>

    </div>
  );
}