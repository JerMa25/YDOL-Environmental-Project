"use client";

import { useState, useEffect } from "react";
import { Trash2, Truck, Users, ClipboardList, Loader2 } from "lucide-react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { api } from "@/src/services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [missionFilter, setMissionFilter] = useState("ALL");
  const [stats, setStats] = useState({
    activeBins: 0,
    drivers: 0,
    clients: 0,
    missionsCount: 0
  });
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [binsCount, driversCount, clientsCount, missionsData] = await Promise.all([
        api.get("/bins/count").catch(() => 0),
        api.get("/drivers").then(d => d.length).catch(() => 0),
        api.get("/clients/count").catch(() => 0),
        api.get("/missions").catch(() => [])
      ]);

      setStats({
        activeBins: binsCount,
        drivers: driversCount,
        clients: clientsCount,
        missionsCount: missionsData.length
      });
      setMissions(missionsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMissions = missions.filter(m => {
    if (missionFilter === "ALL") return true;
    return m.status === missionFilter;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Vue d’ensemble des activités en temps réel</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Actualiser
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<Trash2 />} title="Bacs actifs" value={stats.activeBins} color="green" />
        <Card icon={<Truck />} title="Chauffeurs" value={stats.drivers} color="orange" />
        <Card icon={<Users />} title="Clients" value={stats.clients} color="blue" />
        <Card icon={<ClipboardList />} title="Missions" value={stats.missionsCount} color="purple" />
      </div>

      {/* MISSIONS SECTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Missions récentes</h2>
          <div className="flex gap-2">
            <FilterBtn label="Toutes" value="ALL" state={missionFilter} setState={setMissionFilter} />
            <FilterBtn label="En cours" value="ON_GOING" state={missionFilter} setState={setMissionFilter} />
            <FilterBtn label="Terminées" value="DONE" state={missionFilter} setState={setMissionFilter} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-green-600" /></div>
        ) : filteredMissions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Aucune mission trouvée</div>
        ) : (
          <div className="space-y-3">
            {filteredMissions.slice(0, 5).map((m) => (
              <div key={m.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">Mission #00{m.id}</span>
                  <span className="text-xs text-gray-500">{m.driverName || "Non assigné"} • {m.city}</span>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${m.status === "ON_GOING" ? "bg-yellow-100 text-yellow-700" :
                  m.status === "DONE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {m.status === "ON_GOING" ? "En cours" : m.status === "DONE" ? "Terminée" : "Annulée"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECONDARY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Activité récente</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm">
              <div className="p-2 bg-green-50 rounded-full"><CheckCircleIcon className="text-green-500" fontSize="small" /></div>
              <div>
                <p className="font-medium">Chargement réussi</p>
                <p className="text-gray-500 text-xs text-nowrap">Données synchronisées avec le serveur</p>
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="p-2 bg-blue-50 rounded-full"><LocalShippingIcon className="text-blue-500" fontSize="small" /></div>
              <div>
                <p className="font-medium">Système prêt</p>
                <p className="text-gray-500 text-xs">Prêt pour de nouvelles missions</p>
              </div>
            </li>
          </ul>
        </div>

        {/* WELCOME MESSAGE */}
        <div className="bg-green-600 p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 text-white">
            <h3 className="text-2xl font-bold mb-2">Bienvenue, Admin</h3>
            <p className="opacity-90">Gérez efficacement la collecte des déchets et optimisez vos missions quotidiennes.</p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 scale-150 rotate-12">
            <Truck size={150} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-4 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
}

function FilterBtn({ label, value, state, setState }) {
  return (
    <button
      onClick={() => setState(value)}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${state === value ? "bg-green-600 text-white shadow-md shadow-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );
}