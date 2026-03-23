"use client";

import { useState } from "react";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Plus, ArrowUp, ArrowDown, Filter, Search, Trash2 } from "lucide-react";
import { PersonOff } from "@mui/icons-material";

// ─── ENDPOINT (à brancher plus tard) ─────────────────────────────────────────
// GET  /api/garbage-bins          → liste paginée des bacs
// GET  /api/garbage-bins/:id      → détails d'un bac
// POST /api/garbage-bins          → créer un bac
// PUT  /api/garbage-bins/:id      → modifier un bac
// DELETE /api/garbage-bins/:id    → archiver un bac

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const binsMock = [
  {
    id: 1,
    code: "BAC-YDE-001",
    site: "Centre Collecte Yaoundé",
    city: "Yaoundé",
    district: "Bastos",
    adresse: "Rue des Palmiers, Nr 12",
    type: "Organique",
    capacite: 240,
    tauxRemplissage: 78,
    statut: "ACTIF",
    dernierVidege: "2024-03-18",
    prochainVidege: "2024-03-22",
    chauffeurAssigne: "Tasse Arole",
    latitude: 3.8667,
    longitude: 11.5167,
    created_at: "2024-02-12",
    updated_at: "2024-03-18",
  },
  {
    id: 2,
    code: "BAC-YDE-002",
    site: "Centre Collecte Yaoundé",
    city: "Yaoundé",
    district: "Emana",
    adresse: "Av. de l'Indépendance, Nr 45",
    type: "Recyclable",
    capacite: 120,
    tauxRemplissage: 95,
    statut: "PLEIN",
    dernierVidege: "2024-03-15",
    prochainVidege: "2024-03-22",
    chauffeurAssigne: "Negou Donald",
    latitude: 3.9012,
    longitude: 11.5389,
    created_at: "2024-03-01",
    updated_at: "2024-03-15",
  },
  {
    id: 3,
    code: "BAC-DLA-001",
    site: "Centre Collecte Douala",
    city: "Douala",
    district: "Akwa",
    adresse: "Boulevard de la Liberté, Nr 8",
    type: "Tout venant",
    capacite: 360,
    tauxRemplissage: 42,
    statut: "ACTIF",
    dernierVidege: "2024-03-19",
    prochainVidege: "2024-03-24",
    chauffeurAssigne: "Rouchda Yampen",
    latitude: 4.0511,
    longitude: 9.7085,
    created_at: "2024-01-05",
    updated_at: "2024-03-19",
  },
  {
    id: 4,
    code: "BAC-YDE-003",
    site: "Centre Collecte Yaoundé",
    city: "Yaoundé",
    district: "Nlongkak",
    adresse: "Rue du Stade, Nr 3",
    type: "Organique",
    capacite: 240,
    tauxRemplissage: 15,
    statut: "ACTIF",
    dernierVidege: "2024-03-20",
    prochainVidege: "2024-03-25",
    chauffeurAssigne: "Tasse Arole",
    latitude: 3.8556,
    longitude: 11.5123,
    created_at: "2024-02-20",
    updated_at: "2024-03-20",
  },
  {
    id: 5,
    code: "BAC-DLA-002",
    site: "Centre Collecte Douala",
    city: "Douala",
    district: "Bonapriso",
    adresse: "Rue Prince Bell, Nr 22",
    type: "Recyclable",
    capacite: 120,
    tauxRemplissage: 60,
    statut: "MAINTENANCE",
    dernierVidege: "2024-03-10",
    prochainVidege: "2024-03-27",
    chauffeurAssigne: "Rouchda Yampen",
    latitude: 4.0389,
    longitude: 9.6978,
    created_at: "2024-02-05",
    updated_at: "2024-03-10",
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const STATUT_CONFIG = {
  ACTIF:       { label: "Actif",       bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
  PLEIN:       { label: "Plein",       bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500" },
  MAINTENANCE: { label: "Maintenance", bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500" },
  INACTIF:     { label: "Inactif",     bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400" },
};

const TYPE_CONFIG = {
  "Organique":   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Recyclable":  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  "Tout venant": { bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200" },
};

function RemplissageBar({ value }) {
  const color =
    value >= 90 ? "bg-red-500" :
    value >= 70 ? "bg-amber-400" :
    "bg-green-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold min-w-[32px] text-right ${
        value >= 90 ? "text-red-600" : value >= 70 ? "text-amber-600" : "text-green-600"
      }`}>
        {value}%
      </span>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export default function GarbageBinList({ role = "SUPER_ADMIN" }) {
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("ville");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const uniqueCities = [...new Set(binsMock.map((b) => b.city))];
  const uniqueSites  = [...new Set(binsMock.map((b) => b.site))];
  const filterOptions = filterBy === "ville" ? uniqueCities : uniqueSites;

  const filtered = binsMock.filter((bin) => {
    const matchesSearch =
      bin.code.toLowerCase().includes(search.toLowerCase()) ||
      bin.district.toLowerCase().includes(search.toLowerCase()) ||
      bin.adresse.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterValue === "" ||
      (filterBy === "ville" ? bin.city === filterValue : bin.site === filterValue);

    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "created_at") {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === "remplissage") {
      return sortOrder === "asc"
        ? a.tauxRemplissage - b.tauxRemplissage
        : b.tauxRemplissage - a.tauxRemplissage;
    }
    if (sortBy === "alphabetical") {
      return sortOrder === "asc"
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code);
    }
    return 0;
  });

  return (
    <div className="p-8 min-h-screen bg-gray-50">

      {/* EN-TÊTE */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="text-green-600" size={24} />
            Bacs à ordures
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sorted.length} bac{sorted.length > 1 ? "s" : ""} affiché{sorted.length > 1 ? "s" : ""}
            {filtered.length !== binsMock.length && ` sur ${binsMock.length} au total`}
          </p>
        </div>

        {role === "SUPER_ADMIN" && (
          <Link
            href="/client/garbageBinList/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-sm text-sm"
          >
            <Plus size={18} />
            Ajouter un bac
          </Link>
        )}
      </div>

      {/* BARRE RECHERCHE + FILTRES */}
      <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 shadow-sm flex flex-wrap gap-3 items-center">

        {/* Recherche */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Code, quartier, adresse…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
          />
        </div>

        {/* Type de filtre */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 uppercase tracking-wide">
            <Filter size={13} /> Filtrer par
          </span>
          <select
            value={filterBy}
            onChange={(e) => { setFilterBy(e.target.value); setFilterValue(""); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <option value="ville">Ville</option>
            <option value="site">Site</option>
          </select>
        </div>

        {/* Valeur du filtre */}
        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          disabled={filterOptions.length === 0}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-green-600 text-white font-semibold cursor-pointer min-w-44 focus:outline-none"
        >
          <option value="" className="bg-white text-black">
            Tous les {filterBy === "ville" ? "villes" : "sites"}
          </option>
          {filterOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-black">{opt}</option>
          ))}
        </select>

        {/* Tri */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trier par</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <option value="created_at">Ancienneté</option>
            <option value="remplissage">Taux de remplissage</option>
            <option value="alphabetical">Code (A→Z)</option>
          </select>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setSortOrder("asc")}
              className={`w-9 h-9 flex items-center justify-center transition ${
                sortOrder === "asc" ? "bg-green-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <ArrowUp size={16} />
            </button>
            <button
              onClick={() => setSortOrder("desc")}
              className={`w-9 h-9 flex items-center justify-center transition ${
                sortOrder === "desc" ? "bg-green-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ÉTAT VIDE */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={36} className="text-green-300" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Aucun bac trouvé</h3>
          <p className="text-sm text-gray-400 mb-6 text-center max-w-xs">
            Aucun bac ne correspond à vos critères de recherche.
          </p>
        </div>

      ) : (

        /* TABLE */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr className="text-left">
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Ville / Quartier</th>
                <th className="px-6 py-4 font-semibold">Capacité</th>
                <th className="px-6 py-4 font-semibold w-40">Remplissage</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Prochain vidage</th>
                {role === "SUPER_ADMIN" && (
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {sorted.map((bin) => {
                const statut = STATUT_CONFIG[bin.statut] || STATUT_CONFIG.INACTIF;
                const type   = TYPE_CONFIG[bin.type]    || TYPE_CONFIG["Tout venant"];

                return (
                  <tr
                    key={bin.id}
                    className="border-t border-gray-100 hover:bg-green-50/40 transition cursor-pointer group"
                  >
                    {/* Code — cliquable vers les détails */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/client/garbageBinList/${bin.id}`}
                        className="font-bold text-gray-900 group-hover:text-green-700 transition underline-offset-2 hover:underline"
                      >
                        {bin.code}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{bin.adresse}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${type.bg} ${type.text} ${type.border}`}>
                        {bin.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{bin.city}</span>
                      <p className="text-xs text-gray-400">{bin.district}</p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {bin.capacite} L
                    </td>

                    <td className="px-6 py-4">
                      <RemplissageBar value={bin.tauxRemplissage} />
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statut.bg} ${statut.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
                        {statut.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(bin.prochainVidege).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>

                    {role === "SUPER_ADMIN" && (
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/client/garbageBinList/${bin.id}/edit`}
                            title="Modifier"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EditIcon fontSize="small" />
                          </Link>
                          <button
                            title="Archiver"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                            onClick={(e) => e.stopPropagation()}
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