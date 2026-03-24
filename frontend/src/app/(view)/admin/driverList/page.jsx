"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Plus, ArrowUp, ArrowDown, Filter, Loader2 } from "lucide-react";
import { PersonOff } from "@mui/icons-material";
import { api } from "@/src/services/api";

export default function DriverList({ role = "SUPER_ADMIN" }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("ville"); // "ville" ou "site"
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await api.get("/drivers");
      setDrivers(data || []);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Impossible de charger les chauffeurs");
    } finally {
      setLoading(false);
    }
  };

  const uniqueCities = [...new Set(drivers.map(d => d.city || d.town).filter(Boolean))];
  const uniqueSites = [...new Set(drivers.map(d => d.site).filter(Boolean))];
  const filterOptions = filterBy === "ville" ? uniqueCities : uniqueSites;

  const filteredDrivers = drivers.filter((driver) => {
    const fullName = `${driver.name || driver.firstName} ${driver.surname || driver.lastName || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesFilter = filterValue === "" ||
      (filterBy === "ville" ? (driver.city === filterValue || driver.town === filterValue) : driver.site === filterValue);
    return matchesSearch && matchesFilter;
  });

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortBy === "created_at") {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "alphabetical") {
      const nameA = `${a.name || a.firstName} ${a.surname || a.lastName || ""}`.toLowerCase();
      const nameB = `${b.name || b.firstName} ${b.surname || b.lastName || ""}`.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    return 0;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) return;
    try {
      await api.delete(`/drivers/${id}`);
      setDrivers(drivers.filter(d => d.id !== id));
    } catch (err) {
      console.error("Error deleting driver:", err);
      alert("Erreur lors de la suppression du chauffeur");
    }
  };

  return (
    <div className="p-8">
      {/* SEARCH + FILTERS */}
      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Rechercher un chauffeur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
            <Filter size={16} />
            Filtrer par:
          </span>
          <select
            value={filterBy}
            onChange={(e) => {
              setFilterBy(e.target.value);
              setFilterValue("");
            }}
            className="border rounded-lg px-3 py-2 bg-white outline-none"
          >
            <option value="ville">Ville</option>
            <option value="site">Site</option>
          </select>
        </div>

        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-green-600 text-white font-medium cursor-pointer min-w-48 outline-none"
          disabled={filterOptions.length === 0}
        >
          <option value="" className="bg-white text-black">
            Toutes les {filterBy === "ville" ? "villes" : "sites"}
          </option>
          {filterOptions.map((option) => (
            <option key={option} value={option} className="bg-white text-black">{option}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white outline-none"
            >
              <option value="created_at">Ancienneté</option>
              <option value="alphabetical">Ordre alphabétique</option>
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setSortOrder("asc")}
                className={`w-9 h-9 flex items-center justify-center transition ${sortOrder === "asc" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              >
                <ArrowUp size={18} />
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={`w-9 h-9 flex items-center justify-center transition ${sortOrder === "desc" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              >
                <ArrowDown size={18} />
              </button>
            </div>
          </div>

          <Link
            href="/admin/addDriver"
            className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:scale-110 transition-all font-bold"
            title="Ajouter un chauffeur"
          >
            <Plus size={22} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-500">Chargement des chauffeurs...</p>
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 bg-white rounded-2xl border border-red-100 shadow-sm">
          {error}
          <button onClick={fetchDrivers} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
        </div>
      ) : sortedDrivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
          <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <PersonOff sx={{ fontSize: 80 }} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Aucun chauffeur trouvé</h3>
          <p className="text-gray-500 mb-6 text-center max-w-xs">Aucun chauffeur ne correspond à vos critères.</p>
          <Link
            href="/admin/addDriver"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md font-bold"
          >
            <Plus size={20} /> Ajouter un chauffeur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Nom complet</th>
                <th className="px-6 py-4 font-semibold">Ville</th>
                <th className="px-6 py-4 font-semibold">Quartier</th>
                <th className="px-6 py-4 font-semibold">Téléphone</th>
                {role === "SUPER_ADMIN" && (
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((driver) => (
                <tr key={driver.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {driver.name || driver.firstName} {driver.surname || driver.lastName || ""}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{driver.city || driver.town || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{driver.district || driver.quarter || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600">{driver.phone || "N/A"}</td>
                  {role === "SUPER_ADMIN" && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button title="éditer" className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
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
    </div>
  );
}