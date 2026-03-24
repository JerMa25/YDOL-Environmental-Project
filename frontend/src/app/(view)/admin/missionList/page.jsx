"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { api } from "@/src/services/api";

export default function MissionList() {
  const router = useRouter();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTRES ET RECHERCHES
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]); // aujourd'hui par défaut
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ON_GOING, DONE
  const [searchBy, setSearchBy] = useState("code"); // code ou chauffeur
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await api.get("/missions");
      setMissions(data || []);
    } catch (err) {
      console.error("Error fetching missions:", err);
      setError("Impossible de charger les missions");
    } finally {
      setLoading(false);
    }
  };

  // FILTRAGE
  const filteredMissions = missions.filter(m => {
    // Date (si disponible dans l'objet)
    if (dateFilter && m.start) {
      const missionDate = m.start.split("T")[0];
      if (missionDate !== dateFilter) return false;
    }

    // Status
    if (statusFilter !== "ALL" && m.status !== statusFilter) return false;

    // Search
    if (search) {
      if (searchBy === "code" && m.id && !String(m.id).includes(search)) return false;
      if (searchBy === "chauffeur" && m.driverName && !m.driverName.toLowerCase().includes(search.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Liste des missions</h1>
        </div>

        <button
          onClick={() => router.push("/admin/newMission")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          <Plus size={18} /> Nouvelle mission
        </button>
      </div>

      {/* FILTRES + RECHERCHE */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* DATE */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm flex items-center gap-2">
            Date
            {dateFilter === new Date().toISOString().split('T')[0] && (
              <span className="ml-3 font-bold text-green-600">- Aujourd'hui</span>
            )}
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
          />
        </div>

        {/* STATUS */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm">Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="ALL">Toutes</option>
            <option value="ON_GOING">En cours</option>
            <option value="DONE">Terminées</option>
            <option value="CANCELLED">Annulées</option>
          </select>
        </div>

        {/* SEARCHBY */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm">Rechercher par</label>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="code">ID Mission</option>
            <option value="chauffeur">Chauffeur</option>
          </select>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col flex-1">
          <label className="text-gray-600 text-sm">Recherche</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Rechercher par ${searchBy}`}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-4">
            <Loader2 className="animate-spin text-green-600" size={40} />
            <p>Chargement des missions...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center text-red-500">
            {error}
            <button onClick={fetchMissions} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr className="text-left">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Début</th>
                <th className="px-6 py-4">Chauffeur</th>
                <th className="px-6 py-4">Véhicule</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>

            <tbody>
              {filteredMissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                    Aucune mission trouvée pour cette sélection
                  </td>
                </tr>
              ) : (
                filteredMissions.map(m => (
                  <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-green-700">#00{m.id}</td>
                    <td className="px-6 py-4">{m.start ? new Date(m.start).toLocaleString("fr-FR") : "N/A"}</td>
                    <td className="px-6 py-4">{m.driverName || "Non assigné"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{m.vehicleImmatriculation || "N/A"}</td>
                    <td className="px-6 py-4">{m.district}, {m.city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === "ON_GOING"
                          ? "bg-yellow-100 text-yellow-700"
                          : m.status === "DONE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {m.status === "ON_GOING" ? "En cours" : m.status === "DONE" ? "Terminée" : "Annulée"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}