"use client";

import { useState, useEffect } from "react";
import {
  Calendar, Clock, RefreshCw,
  MessageSquare, Trash2,
  CheckCircle, History, X
} from "lucide-react";

// ───────── API CONFIG ─────────
const API_BASE = "http://localhost:8080/api";

const API = {
  profil: `${API_BASE}/citoyen/profil`,
  collectes: `${API_BASE}/collectes-vip`,
};

export default function CollecteVIP() {

  // ───────── STATES ─────────
  const [collectes, setCollectes] = useState([]);
  const [citoyen, setCitoyen] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [frequence, setFrequence] = useState("ponctuelle");
  const [note, setNote] = useState("");

  const FREQUENCES = [
    "ponctuelle",
    "hebdomadaire",
    "bi-hebdomadaire",
    "mensuelle"
  ];

  // ───────── LOAD DATA ─────────
  useEffect(() => {
    fetchProfil();
    fetchCollectes();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await fetch(API.profil);
      const data = await res.json();
      setCitoyen(data);
    } catch (err) {
      console.error("Erreur profil", err);
    }
  };

  const fetchCollectes = async () => {
    try {
      const res = await fetch(`${API.collectes}?citoyenId=1`);
      const data = await res.json();
      setCollectes(data);
    } catch (err) {
      console.error("Erreur collectes", err);
    }
  };

  // ───────── CREATE ─────────
  const handleSubmit = async () => {
    if (!date || !heure) return;

    setLoading(true);

    try {
      const res = await fetch(API.collectes, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citoyenId: 1,
          date,
          heure,
          frequence,
          noteChaufeur: note,
        }),
      });

      if (!res.ok) throw new Error();

      const nouvelle = await res.json();
      setCollectes(prev => [nouvelle, ...prev]);

      setDate("");
      setHeure("");
      setNote("");

    } catch (err) {
      console.error("Erreur création", err);
    }

    setLoading(false);
  };

  // ───────── DELETE ─────────
  const handleDelete = async (id) => {
    try {
      await fetch(`${API.collectes}/${id}`, {
        method: "DELETE",
      });

      setCollectes(prev => prev.filter(c => c.id !== id));

    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  // ───────── UI ─────────
  return (
    <div className="min-h-screen p-6">

      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black text-green-800">
              Collecte VIP
            </h1>
            <p className="text-xs text-gray-400">
              {citoyen?.adresse || "Chargement..."}
            </p>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 text-sm bg-white border px-4 py-2 rounded-xl hover:bg-green-50 transition"
          >
            <History size={16} />
            Historique
          </button>
        </div>

        {/* FORMULAIRE */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

          <h2 className="font-bold mb-5 text-gray-800">
            Programmer une collecte
          </h2>

          <div className="grid gap-5">

            {/* DATE */}
            <div>
              <label className="text-xs text-gray-400">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={16}/>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border rounded-xl pl-10 py-2.5"
                />
              </div>
            </div>

            {/* HEURE */}
            <div>
              <label className="text-xs text-gray-400">Heure</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={16}/>
                <input
                  type="time"
                  value={heure}
                  onChange={e => setHeure(e.target.value)}
                  className="w-full border rounded-xl pl-10 py-2.5"
                />
              </div>
            </div>

            {/* FREQUENCE */}
            <div>
              <label className="text-xs text-gray-400">Fréquence</label>
              <div className="relative">
                <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={16}/>
                <select
                  value={frequence}
                  onChange={e => setFrequence(e.target.value)}
                  className="w-full border rounded-xl pl-10 py-2.5 bg-white"
                >
                  {FREQUENCES.map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* NOTE */}
            <div>
              <label className="text-xs text-gray-400">
                Instructions (optionnel)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-green-600" size={16}/>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full border rounded-xl pl-10 py-2.5"
                  rows={2}
                />
              </div>
            </div>

            {/* RESUME */}
            {date && heure && (
              <div className="bg-green-600 text-white rounded-xl p-3 text-sm">
                <p className="font-bold">Résumé</p>
                <p>
                  {date} à {heure} • {frequence}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className="bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center gap-2"
            >
              {loading ? "..." : <>
                <CheckCircle size={16}/>
                Confirmer
              </>}
            </button>

          </div>
        </div>

        {/* LISTE RECENTE */}
        <div className="bg-white rounded-xl border p-4">

          <h3 className="font-bold mb-3 text-gray-800">
            Collectes récentes
          </h3>

          {collectes.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Aucune collecte
            </p>
          ) : (
            collectes.slice(0, 3).map(c => (
              <div key={c.id} className="flex justify-between py-2 border-b">

                <div>
                  <p className="font-semibold">{c.date}</p>
                  <p className="text-xs text-gray-400">{c.heure}</p>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  <Trash2 size={16}/>
                </button>

              </div>
            ))
          )}
        </div>

        {/* MODAL HISTORIQUE */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto">

              <div className="flex justify-between mb-4">
                <h2 className="font-bold">Historique</h2>
                <X onClick={() => setShowHistory(false)} className="cursor-pointer"/>
              </div>

              {collectes.length === 0 ? (
                <p className="text-gray-400 text-center">
                  Aucun historique
                </p>
              ) : (
                collectes.map(c => (
                  <div key={c.id} className="border-b py-2 text-sm flex justify-between">
                    <span>{c.date} • {c.heure}</span>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}