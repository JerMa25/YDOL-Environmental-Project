"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Check, Circle, Truck, User } from "lucide-react";
import { api } from "@/src/services/api";

export default function NewMission() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form states
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setFetching(true);
      const [driversData, vehiclesData] = await Promise.all([
        api.get("/drivers"),
        api.get("/vehicles")
      ]);
      setDrivers(driversData || []);
      setVehicles(vehiclesData || []);
    } catch (err) {
      console.error("Error loading mission data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDriver || !selectedVehicle) {
      alert("Veuillez sélectionner un chauffeur et un véhicule");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        start: startDate,
        status: "ON_GOING",
        driverId: selectedDriver.id,
        vehicleId: selectedVehicle.id,
        city,
        district,
        description,
        priority
      };

      await api.post("/missions", payload);
      router.push("/admin/missionList");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Erreur lors de la création de la mission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-800">Assigner une nouvelle mission</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Ville</label>
              <input
                type="text" required value={city} onChange={e => setCity(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Douala"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Quartier / Zone</label>
              <input
                type="text" required value={district} onChange={e => setDistrict(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Akwa"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Date et heure de début</label>
            <input
              type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Description / Instructions</label>
            <textarea
              rows="3" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Instructions pour la collecte..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* DRIVER SELECT */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Chauffeur</label>
              <button
                type="button"
                onClick={() => setIsDriverModalOpen(true)}
                className={`w-full mt-1 p-4 border-2 rounded-xl text-left transition-all flex items-center gap-3 ${selectedDriver ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-green-400"
                  }`}
              >
                <div className="bg-white p-2 rounded-lg shadow-sm border"><User size={20} className="text-green-600" /></div>
                <div>
                  <p className="font-bold text-gray-800">{selectedDriver ? `${selectedDriver.name} ${selectedDriver.surname || ""}` : "Choisir un chauffeur"}</p>
                  <p className="text-xs text-gray-500">{selectedDriver ? selectedDriver.phone : "Aucun chauffeur sélectionné"}</p>
                </div>
              </button>
            </div>

            {/* VEHICLE SELECT */}
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600">Véhicule</label>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(true)}
                className={`w-full mt-1 p-4 border-2 rounded-xl text-left transition-all flex items-center gap-3 ${selectedVehicle ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-green-400"
                  }`}
              >
                <div className="bg-white p-2 rounded-lg shadow-sm border"><Truck size={20} className="text-green-600" /></div>
                <div>
                  <p className="font-bold text-gray-800">{selectedVehicle ? selectedVehicle.immatriculation : "Choisir un véhicule"}</p>
                  <p className="text-xs text-gray-500">{selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : "Aucun véhicule sélectionné"}</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition">Annuler</button>
            <button type="submit" disabled={loading} className="px-8 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={18} />}
              Créer la mission
            </button>
          </div>
        </div>
      </form>

      {/* DRIVER MODAL */}
      {isDriverModalOpen && (
        <SelectionModal
          title="Sélectionner un chauffeur"
          items={drivers}
          selectedId={selectedDriver?.id}
          onSelect={(d) => { setSelectedDriver(d); setIsDriverModalOpen(false); }}
          onClose={() => setIsDriverModalOpen(false)}
          renderItem={(d) => (
            <div className="flex flex-col">
              <p className="font-bold">{d.name} {d.surname}</p>
              <p className="text-xs text-gray-500">{d.phone}</p>
            </div>
          )}
        />
      )}

      {/* VEHICLE MODAL */}
      {isVehicleModalOpen && (
        <SelectionModal
          title="Sélectionner un véhicule"
          items={vehicles}
          selectedId={selectedVehicle?.id}
          onSelect={(v) => { setSelectedVehicle(v); setIsVehicleModalOpen(false); }}
          onClose={() => setIsVehicleModalOpen(false)}
          renderItem={(v) => (
            <div className="flex flex-col">
              <p className="font-bold">{v.immatriculation}</p>
              <p className="text-xs text-gray-500">{v.brand} {v.model}</p>
            </div>
          )}
        />
      )}
    </div>
  );
}

function SelectionModal({ title, items, selectedId, onSelect, onClose, renderItem }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 ? (
            <p className="text-center py-10 text-gray-400">Aucune donnée disponible</p>
          ) : (
            items.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 rounded-2xl flex items-center justify-between border transition-all ${selectedId === item.id ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-green-300 hover:bg-gray-50"
                  }`}
              >
                {renderItem(item)}
                {selectedId === item.id ? <Check className="text-green-600" /> : <Circle className="text-gray-200" />}
              </button>
            ))
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <button onClick={onClose} className="w-full py-3 bg-white border font-bold rounded-2xl hover:bg-gray-100 transition">Fermer</button>
        </div>
      </div>
    </div>
  );
}