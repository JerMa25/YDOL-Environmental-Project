"use client";

import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminEditModal from "@/src/components/layout/Modals/AdminEditModal";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { PersonOff } from "@mui/icons-material";
import { api } from "@/src/services/api";

export default function AdminList({ role = "SUPER_ADMIN" }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await api.get("/admins");
      setAdmins(data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Impossible de charger les administrateurs");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.name} ${admin.surname || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesCity = cityFilter === "" || admin.city === cityFilter || admin.town === cityFilter;
    return matchesSearch && matchesCity;
  });

  const uniqueCities = [
    ...new Set(admins.map((a) => a.city || a.town).filter(Boolean))
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) return;
    try {
      await api.delete(`/admins/${id}`);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert("Erreur lors de la suppression de l'administrateur");
    }
  };

  return (
    <div className="p-8">
      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un administrateur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border-green-700 rounded-lg px-4 py-2 bg-green-600 text-white font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          <option value="" className="bg-white text-black">Toutes les villes</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city} className="bg-white text-black">{city}</option>
          ))}
        </select>

        {role === "SUPER_ADMIN" && (
          <Link
            href="/admin/addAdmin"
            className="ml-auto flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:scale-110 transition-all active:scale-95 cursor-pointer"
            title="Ajouter un administrateur"
          >
            <Plus size={24} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-500">Chargement des administrateurs...</p>
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 bg-white rounded-2xl border border-red-100 shadow-sm">
          {error}
          <button onClick={fetchAdmins} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <PersonOff sx={{ fontSize: 80 }} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Aucun administrateur trouvé</h3>
          <p className="text-gray-500 mb-6 text-center max-w-xs">
            Il semble qu'aucun administrateur ne corresponde à vos critères.
          </p>
          {role === "SUPER_ADMIN" && (
            <Link
              href="/admin/addAdmin"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} />
              Ajouter un administrateur
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Nom complet</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Ville</th>
                <th className="px-6 py-4 font-semibold">Téléphone</th>
                {role === "SUPER_ADMIN" && (
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {admin.name} {admin.surname || ""}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.city || admin.town || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{admin.phone || "N/A"}</td>
                  {role === "SUPER_ADMIN" && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setSelectedAdmin(admin)}
                          title="éditer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          title="supprimer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAdmin && (
        <AdminEditModal
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
        />
      )}
    </div>
  );
}