"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Filter, Loader2, Star as StarIcon } from "lucide-react";
import { api } from "@/src/services/api";

export default function ClientList({ role = "SUPER_ADMIN" }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.get("/clients");
      setClients(data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    try {
      await api.delete(`/clients/${id}`);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Erreur lors de la suppression du client.");
    }
  };

  const uniqueCities = [...new Set(clients.map(c => c.city || c.town).filter(Boolean))];

  const filteredClients = clients.filter((client) => {
    const displayName = `${client.name || ""} ${client.surname || ""}`.toLowerCase();
    const matchesSearch = displayName.includes(search.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesCity = filterCity === "" || client.town === filterCity || client.city === filterCity;
    const matchesType = filterType === "" || client.type === filterType;

    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="p-8">
      {/* HEADER & FILTERS */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un client (nom, email)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={18} />
          <span className="text-sm font-medium">Ville :</span>
        </div>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 bg-green-600 text-white font-medium outline-none min-w-[150px]"
        >
          <option value="" className="bg-white text-black">Toutes les villes</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city} className="bg-white text-black">{city}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 text-gray-500 ml-2">
          <span className="text-sm font-medium">Type :</span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 font-medium outline-none"
        >
          <option value="">Tous les types</option>
          <option value="PREMIUM">PREMIUM</option>
          <option value="STANDARD">STANDARD</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-500">Chargement des clients...</p>
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 bg-white rounded-2xl border border-red-100 shadow-sm">
          {error}
          <button onClick={fetchClients} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Filter size={64} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Aucun client trouvé</h3>
          <p className="text-gray-500 mb-6 text-center max-w-xs">Aucun client ne correspond à vos filtres.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr className="text-left font-semibold">
                <th className="px-6 py-4">Logo</th>
                <th className="px-6 py-4">Nom complet</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Ville</th>
                <th className="px-6 py-4">Type</th>
                {role === "SUPER_ADMIN" && (
                  <th className="px-6 py-4 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => {
                const displayName = `${client.name || ""} ${client.surname || ""}`.trim();
                return (
                  <tr key={client.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold uppercase">
                        {displayName ? displayName.charAt(0) : "?"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 capitalize leading-tight">
                      {displayName || "Sans nom"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-gray-600">{client.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{client.town || client.city || "N/A"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {client.type === "PREMIUM" && <StarIcon size={14} className="fill-amber-500 text-amber-500" />}
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${client.type === "PREMIUM" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-600"}`}>
                          {client.type || "STANDARD"}
                        </span>
                      </div>
                    </td>
                    {role === "SUPER_ADMIN" && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button title="éditer" className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            title="supprimer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}