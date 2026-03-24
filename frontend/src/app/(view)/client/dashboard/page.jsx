"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Plus, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { PersonOff } from "@mui/icons-material";


// ─── MOCK DATA ────────────────────────────────────────────────────────────────
 
const mockCitoyen = {
  id: "c001",
  nom: "Alice Ngo",
  telephone: "+237 691 111 222",
  quartier: "Bastos",
  adresse: "Rue des Palmiers, Nr 12",
  ville: "Yaoundé",
  abonnement: "standard", // "standard" | "vip"
  avatar: "AN",
};
 
const mockProchainneCollecte = {
  zone: "Bastos",
  date: "Aujourd'hui",
  heure: "14h30",
  chauffeur: "Jean-Pierre Mvondo",
  statut: "en_route", // "planifiée" | "en_route" | "collecte" | "terminée"
  distanceEstimee: "~2 km de chez vous",
  bacsRestants: 13,
};
 
const mockMesSignalements = [
  {
    id: "s1",
    type: "Bac plein",
    adresse: "Rue des Palmiers Nr 12",
    date: "Aujourd'hui, 08h14",
    statut: "assigné",
    reponse: "Un chauffeur a été assigné à votre signalement.",
  },
  {
    id: "s2",
    type: "Débordement",
    adresse: "Rue des Palmiers Nr 12",
    date: "Lundi 18 mars, 10h02",
    statut: "résolu",
    reponse: "Collecte effectuée. Merci pour votre signalement.",
  },
  {
    id: "s3",
    type: "Accès bloqué",
    adresse: "Carrefour Bastos Nr 5",
    date: "Jeudi 14 mars, 16h45",
    statut: "résolu",
    reponse: "Problème résolu par l'équipe de collecte.",
  },
];
 
const mockHistorique = [
  { id: "h1", date: "Lundi 18 mars",    heure: "09h45", zone: "Bastos", statut: "effectuée", note: 5 },
  { id: "h2", date: "Vendredi 15 mars", heure: "10h20", zone: "Bastos", statut: "effectuée", note: 4 },
  { id: "h3", date: "Lundi 11 mars",    heure: "09h55", zone: "Bastos", statut: "effectuée", note: 5 },
  { id: "h4", date: "Vendredi 08 mars", heure: "10h10", zone: "Bastos", statut: "manquée",   note: null },
  { id: "h5", date: "Lundi 04 mars",    heure: "09h40", zone: "Bastos", statut: "effectuée", note: 5 },
];
 
const mockOffresVIP = [
  {
    id: "v1",
    titre: "Collecte Express",
    description: "Collecte à la demande en moins de 2h, 7j/7",
    prix: "5 000 FCFA / collecte",
    icone: "⚡",
    populaire: false,
  },
  {
    id: "v2",
    titre: "Abonnement VIP Mensuel",
    description: "Collectes prioritaires + notifications avancées + support dédié",
    prix: "15 000 FCFA / mois",
    icone: "⭐",
    populaire: true,
  },
  {
    id: "v3",
    titre: "Pack Famille",
    description: "2 adresses couvertes, collectes bi-hebdomadaires programmées",
    prix: "25 000 FCFA / mois",
    icone: "🏠",
    populaire: false,
  },
];
 
// ─── ENDPOINTS API ────────────────────────────────────────────────────────────
// GET  /api/citoyen/profil
// GET  /api/citoyen/collecte-prochaine
// GET  /api/citoyen/signalements
// POST /api/citoyen/signalements        — créer un signalement
// GET  /api/citoyen/historique
// GET  /api/citoyen/offres-vip
// POST /api/citoyen/offres-vip/:id      — souscrire à une offre
 
const API = process.env.NEXT_PUBLIC_API_URL || "";
 
async function get(path, fallback) {
  try {
    const r = await fetch(`${API}${path}`);
    const d = await r.json();
    return d.data;
  } catch {
    return fallback;
  }
}
 
async function post(path, body) {
  try {
    const r = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await r.json();
  } catch {
    return { success: true };
  }
}
 
// ─── CONFIG STATUTS ───────────────────────────────────────────────────────────
 
const STATUT_COLLECTE = {
  planifiée: { label: "Planifiée",   bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" },
  en_route:  { label: "En route",    bg: "#fef9c3", color: "#713f12", dot: "#eab308" },
  collecte:  { label: "En collecte", bg: "#dbeafe", color: "#1e3a8a", dot: "#3b82f6" },
  terminée:  { label: "Terminée",    bg: "#dcfce7", color: "#14532d", dot: "#22c55e" },
};
 
const STATUT_SIGNAL = {
  nouveau: { label: "Envoyé",   bg: "#dbeafe", color: "#1e3a8a" },
  assigné: { label: "En cours", bg: "#fef9c3", color: "#713f12" },
  résolu:  { label: "Résolu",   bg: "#dcfce7", color: "#14532d" },
};
  
 
function ProchainneCollecteCard({ collecte }) {
  const cfg = STATUT_COLLECTE[collecte.statut];
  const progression = { planifiée: 10, en_route: 45, collecte: 75, terminée: 100 }[collecte.statut];
 
  return (
    <div style={{
      background: "linear-gradient(135deg, #162d22 0%, #1e4433 100%)",
      borderRadius: 16, padding: "22px 24px", color: "#fff", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(45,158,107,.15)" }} />
      <div style={{ position: "absolute", right: 20, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(45,158,107,.1)" }} />
 
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 5 }}>
              Prochaine collecte
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>
              {collecte.date} à {collecte.heure}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 5 }}>
              📍 {collecte.zone} &nbsp;·&nbsp; {collecte.distanceEstimee}
            </div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
            background: cfg.bg, color: cfg.color,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
            {cfg.label}
          </span>
        </div>
 
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Progression de la tournée</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 700 }}>{progression}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.15)", borderRadius: 99 }}>
            <div style={{ width: `${progression}%`, height: "100%", background: "#2d9e6b", borderRadius: 99, transition: "width .6s" }} />
          </div>
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,.6)" }}>
          <span style={{ marginLeft: "auto" }}>🗑️ {collecte.bacsRestants} bacs avant votre adresse</span>
        </div>
      </div>
    </div>
  );
}
 
function StatsMini({ historique }) {
  const effectuees = historique.filter(h => h.statut === "effectuée").length;
  const total = historique.length;
  const notesValides = historique.filter(h => h.note);
  const noteMoyenne = notesValides.reduce((s, h) => s + h.note, 0) / notesValides.length;
 
  const stats = [
    { label: "Collectes ce mois",  value: effectuees,                                 icon: "🗑️", bg: "#dcfce7", color: "#2d9e6b" },
    { label: "Taux de collecte",   value: `${Math.round((effectuees / total) * 100)}%`, icon: "📊", bg: "#dbeafe", color: "#3b82f6" },
    { label: "Note moyenne",       value: `${noteMoyenne.toFixed(1)}/5`,               icon: "⭐", bg: "#fef9c3", color: "#eab308" },
  ];
 
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #e5ede9", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
 
function MesSignalements({ signalements }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5ede9", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #e5ede9" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Mes signalements</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
          {signalements.length} signalement{signalements.length > 1 ? "s" : ""} envoyé{signalements.length > 1 ? "s" : ""}
        </div>
      </div>
      <div>
        {signalements.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            Aucun signalement pour le moment
          </div>
        ) : signalements.map(s => {
          const cfg = STATUT_SIGNAL[s.statut] || STATUT_SIGNAL.nouveau;
          return (
            <div key={s.id} style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.type}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 5 }}>📍 {s.adresse} · {s.date}</div>
              {s.reponse && (
                <div style={{ fontSize: 11, color: "#374151", background: "#f9fafb", borderRadius: 8, padding: "7px 10px", borderLeft: "3px solid #2d9e6b" }}>
                  💬 {s.reponse}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
function Historique({ historique }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5ede9", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #e5ede9" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Historique des collectes</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Dernières collectes dans votre zone</div>
      </div>
      <div>
        {historique.map((h, i) => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", borderBottom: i < historique.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: h.statut === "effectuée" ? "#dcfce7" : "#fee2e2",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
              {h.statut === "effectuée" ? "✅" : "❌"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{h.date}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>🕐 {h.heure} · Zone {h.zone}</div>
            </div>
            {h.note ? (
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} style={{ fontSize: 13, color: n <= h.note ? "#eab308" : "#e5e7eb" }}>★</span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>Manquée</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
 
function OffresVIP({ offres, abonnement }) {
  const [souscrit, setSouscrit] = useState(null);
 
  const handleSouscrire = async (offre) => {
    await post(`/api/citoyen/offres-vip/${offre.id}`, { citoyenId: "c001" });
    setSouscrit(offre.id);
  };
 
  return (
    <div style={{ background: "#fff", border: "1px solid #e5ede9", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #e5ede9" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Offres &amp; services VIP</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Améliorez votre expérience de collecte</div>
      </div>
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {offres.map(offre => (
          <div key={offre.id} style={{
            border: offre.populaire ? "2px solid #2d9e6b" : "1px solid #e5ede9",
            borderRadius: 12, padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 14,
            background: offre.populaire ? "#f0fdf4" : "#fff",
            position: "relative",
          }}>
            {offre.populaire && (
              <div style={{ position: "absolute", top: -10, right: 14, background: "#2d9e6b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 20 }}>
                POPULAIRE
              </div>
            )}
            <div style={{ width: 42, height: 42, borderRadius: 11, background: offre.populaire ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {offre.icone}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{offre.titre}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{offre.description}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#2d9e6b", marginTop: 4 }}>{offre.prix}</div>
            </div>
            <button
              onClick={() => handleSouscrire(offre)}
              disabled={souscrit === offre.id || abonnement === "vip"}
              style={{
                padding: "8px 14px", borderRadius: 9, border: "none",
                fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                background: souscrit === offre.id ? "#dcfce7" : offre.populaire ? "#2d9e6b" : "#f3f4f6",
                color: souscrit === offre.id ? "#14532d" : offre.populaire ? "#fff" : "#374151",
                transition: "all .2s",
              }}
            >
              {souscrit === offre.id ? "✓ Souscrit" : "Souscrire"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function SignalementModal({ onClose, onSubmit }) {
  const [type, setType] = useState("Bac plein");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
 
  const types = ["Bac plein", "Débordement", "Accès bloqué", "Bac endommagé"];
 
  const handleSubmit = async () => {
    await onSubmit({ type, description: desc });
    setSent(true);
    setTimeout(onClose, 2200);
  };
 
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #e5ede9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>🚨 Signaler un problème</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#9ca3af", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
 
        {sent ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#14532d", marginBottom: 6 }}>Signalement envoyé !</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>La tour de contrôle a été notifiée. Vous serez informé(e) du suivi.</div>
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Type de problème</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {types.map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    padding: "9px 12px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: type === t ? "2px solid #2d9e6b" : "1px solid #e5e7eb",
                    background: type === t ? "#f0fdf4" : "#f9fafb",
                    color: type === t ? "#14532d" : "#374151",
                  }}>{t}</button>
                ))}
              </div>
            </div>
 
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Description (optionnel)</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Décrivez le problème..."
                rows={3}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 9, fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none" }}
              />
            </div>
 
            <div style={{ background: "#f9fafb", borderRadius: 9, padding: "10px 12px", fontSize: 11, color: "#6b7280", marginBottom: 16 }}>
              📍 Adresse détectée : <strong style={{ color: "#111827" }}>Rue des Palmiers Nr 12, Bastos</strong>
            </div>
 
            <button onClick={handleSubmit} style={{
              width: "100%", padding: 11, background: "#2d9e6b", color: "#fff",
              border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: "pointer",
            }}>
              Envoyer le signalement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DriverList({ role = "SUPER_ADMIN" }) {

  const [citoyen, setCitoyen]           = useState(mockCitoyen);
  const [collecte, setCollecte]         = useState(mockProchainneCollecte);
  const [signalements, setSignalements] = useState(mockMesSignalements);
  const [historique, setHistorique]     = useState(mockHistorique);
  const [offres, setOffres]             = useState(mockOffresVIP);
  const [showModal, setShowModal]       = useState(false);
 
  const loadAll = useCallback(async () => {
    const [c, col, sig, hist, off] = await Promise.all([
      get("/api/citoyen/profil",             mockCitoyen),
      get("/api/citoyen/collecte-prochaine", mockProchainneCollecte),
      get("/api/citoyen/signalements",       mockMesSignalements),
      get("/api/citoyen/historique",         mockHistorique),
      get("/api/citoyen/offres-vip",         mockOffresVIP),
    ]);
    setCitoyen(c);
    setCollecte(col);
    setSignalements(sig);
    setHistorique(hist);
    setOffres(off);
  }, []);
 
  useEffect(() => {
    //loadAll();
    const id = setInterval(loadAll, 30000);
    return () => clearInterval(id);
  }, [loadAll]);
 
  const handleSubmitSignalement = async (data) => {
    const res = await post("/api/citoyen/signalements", data);
    const nouveau = {
      id: `s${Date.now()}`,
      type: data.type,
      adresse: citoyen.adresse,
      date: "À l'instant",
      statut: "nouveau",
      reponse: null,
    };
    setSignalements(prev => [nouveau, ...prev]);
    return res;
  };
 
  const unreadSignalements = signalements.filter(s => s.statut === "nouveau").length;
 

  return (
  <div className="bg-gray-50 min-h-full">

    <main className="max-w-6xl mx-auto p-6 space-y-6">

  {/* HEADER */}
  <div>
    <h1 className="text-2xl font-bold text-gray-800">
      Dashboard
    </h1>
    <p className="text-sm text-gray-500">
      Bienvenue, {citoyen.nom}
    </p>
  </div>

  {/* PROCHAINE COLLECTE */}
  <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl p-6 shadow-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-80">Prochaine collecte</p>
        <h2 className="text-2xl font-bold">
          {collecte.date} - {collecte.heure}
        </h2>
        <p className="text-sm opacity-80 mt-1">
          📍 {collecte.zone} · {collecte.distanceEstimee}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm">🗑️ {collecte.bacsRestants} bacs</p>
        <p className="text-xs opacity-70">avant votre maison</p>
      </div>
    </div>
  </div>

  {/* MINI CARDS */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    {/* Collectes */}
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <p className="text-xs text-gray-500">Collectes</p>
      <h3 className="text-xl font-bold text-gray-800">
        {historique.filter(h => h.statut === "effectuée").length}
      </h3>
    </div>

    {/* Taux */}
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <p className="text-xs text-gray-500">Taux réussite</p>
      <h3 className="text-xl font-bold text-green-600">
        {Math.round(
          (historique.filter(h => h.statut === "effectuée").length / historique.length) * 100
        )}%
      </h3>
    </div>

    {/* Temps estimé */}
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <p className="text-xs text-gray-500">Temps estimé</p>
      <h3 className="text-xl font-bold text-gray-800">
        30 min
      </h3>
    </div>

    {/* Statut */}
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <p className="text-xs text-gray-500">Statut</p>
      <h3 className="text-sm font-bold text-yellow-600">
        En cours
      </h3>
    </div>

  </div>

  {/* GRID BAS */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* HISTORIQUE */}
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          Historique
        </h3>

        <Link href="/historique" className="text-green-600 text-sm">
          Voir +
        </Link>
      </div>

      <div className="space-y-3">
        {historique.slice(0, 4).map((h) => (
          <div key={h.id} className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                {h.date}
              </p>
              <p className="text-xs text-gray-400">
                {h.heure}
              </p>
            </div>

            <span className={`text-sm font-semibold ${
              h.statut === "effectuée"
                ? "text-green-600"
                : "text-red-500"
            }`}>
              {h.statut === "effectuée" ? "✔" : "✖"}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* ETAT DU SERVICE */}
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-4">
        État du service
      </h3>

      <div className="space-y-4">

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Camions actifs</span>
          <span className="font-bold text-green-700">12</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Collectes en cours</span>
          <span className="font-bold text-yellow-600">5</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Temps moyen</span>
          <span className="font-bold text-gray-800">35 min</span>
        </div>

      </div>

      {/* CTA */}
      {citoyen.abonnement !== "vip" && (
        <div className="mt-5 p-4 bg-green-50 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-green-800">
              Passez VIP 🚀
            </p>
            <p className="text-xs text-green-600">
              Priorité + collecte rapide
            </p>
          </div>

          <Link
            href="/vip"
            className="bg-green-700 text-white px-3 py-1 rounded-md text-sm"
          >
            Upgrade
          </Link>
        </div>
      )}
    </div>

  </div>

</main>
  </div>
);
}