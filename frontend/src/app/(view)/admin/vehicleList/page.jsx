"use client";

import { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/src/services/api";

export default function VehicleList({ role = "SUPER_ADMIN" }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await api.get("/vehicles");
      setVehicles(data || []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Impossible de charger les véhicules");
    } finally {
      setLoading(false);
    }
  };

  const brands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.immatriculation || "").toLowerCase().includes(search.toLowerCase());
    const matchesBrand = filterBrand === "" || v.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Erreur lors de la suppression du véhicule");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher par immatriculation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={18} />
          <span className="font-medium">Marque :</span>
        </div>

        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-green-600 text-white outline-none"
        >
          <option value="" className="bg-white text-black">Toutes les marques</option>
          {brands.map((brand) => (
            <option key={brand} value={brand} className="bg-white text-black">{brand}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/admin/addVehicle"
            className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 hover:scale-110 transition-all font-bold"
            title="Ajouter un véhicule"
          >
            <Plus size={22} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-green-600" size={48} />
          <p className="mt-4 text-gray-500">Chargement des véhicules...</p>
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 bg-white rounded-2xl border border-red-100 shadow-sm">
          {error}
          <button onClick={fetchVehicles} className="block mx-auto mt-4 text-green-600 underline">Réessayer</button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-white rounded-2xl border border-dashed border-gray-100 shadow-sm">
          Aucun véhicule trouvé.
          <Link href="/admin/addVehicle" className="block text-green-600 mt-2 font-medium">Ajouter le premier véhicule</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                {vehicle.imagePath ? (
                  <img src={vehicle.imagePath} alt="vehicle" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-3xl">🚛</div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-green-700 mb-2">{vehicle.immatriculation}</h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Marque:</span> {vehicle.brand}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Modèle:</span> {vehicle.modele || vehicle.model}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Capacité:</span> {vehicle.maxCapacity || vehicle.maxWeight} kg</p>
                  </div>
                </div>

                {role === "SUPER_ADMIN" && (
                  <div className="flex gap-2 mt-4 justify-end">
                    <button title="éditer" className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      title="supprimer"
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}