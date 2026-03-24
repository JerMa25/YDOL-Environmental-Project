"use client";

import { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/src/services/api";

export default function GarbageBinList({ role = "SUPER_ADMIN" }) {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      setLoading(true);
      const data = await api.get("/bins");
      setBins(data || []);
    } catch (err) {
      console.error("Error fetching bins:", err);
      setError("Impossible de charger les bacs");
    } finally {
      setLoading(false);
    }
  };

  const cities = [...new Set(bins.map(b => b.town).filter(Boolean))];

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const filteredBins = bins.filter(bin => {
    const matchesSearch = (bin.code || "").toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity === "" || bin.town === filterCity;
    return matchesSearch && matchesCity;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce bac ?")) return;
    try {
      await api.delete(`/bins/${id}`);
      setBins(bins.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting bin:", err);
      alert("Erreur lors de la suppression du bac");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher par code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={18} />
          <span className="font-medium">Ville :</span>
        </div>

        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-green-600 text-white outline-none"
        >
          <option value="" className="bg-white text-black">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city} className="bg-white text-black">{city}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/admin/addGarbageBin"
            className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:scale-110 transition-all font-bold"
            title="Ajouter un bac"
          >
            <Plus size={22} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-500">Chargement des bacs...</p>
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 bg-white rounded-2xl border border-red-100 shadow-sm">
          {error}
          <button onClick={fetchBins} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
        </div>
      ) : filteredBins.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-white rounded-2xl border border-dashed border-gray-100 shadow-sm">
          Aucun bac trouvé.
          <Link href="/admin/addGarbageBin" className="block text-green-600 mt-2 font-medium">Ajouter le premier bac</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBins.map((bin) => (
            <div key={bin.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-2xl">
                  🗑️
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${bin.status === "AVAILABLE" ? "bg-green-100 text-green-600" : bin.status === "FULL" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {bin.status || "STATE"}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">{bin.code}</h2>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p><span className="font-semibold text-gray-400">Ville:</span> {bin.town}</p>
                <p><span className="font-semibold text-gray-400">Quartier:</span> {bin.quarter || bin.district}</p>
                <p><span className="font-semibold text-gray-400">Ajouté le:</span> {formatDate(bin.createdAt)}</p>
              </div>

              {role === "SUPER_ADMIN" && (
                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button title="éditer" className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDelete(bin.id)}
                    title="supprimer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}