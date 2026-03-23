"use client";

// ─── ENDPOINTS (à brancher plus tard) ────────────────────────────────────────
// GET  /api/citoyen/profil                     → infos citoyen + statut abonnement
// GET  /api/collectes-vip?citoyenId=:id        → liste des collectes VIP programmées
// POST /api/collectes-vip                      → programmer une collecte VIP
//   Body: { citoyenId, date, heure, frequence, noteChaufeur }
// DELETE /api/collectes-vip/:id               → annuler une collecte VIP
// GET  /api/offres-vip                         → liste des offres pour l'upgrade

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, Calendar, Clock, RefreshCw,
  MessageSquare, Plus, Trash2, CheckCircle,
  Lock, ChevronRight, AlertTriangle, X
} from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockCitoyen = {
  id: "c001",
  nom: "Alice Ngo",
  avatar: "AN",
  abonnement: "vip", // changer en "standard" pour tester le mur d'upgrade
  adresse: "Rue des Palmiers Nr 12, Bastos",
  ville: "Yaoundé",
};

const mockCollectesVIP = [
  {
    id: "cv1",
    date: "2024-03-25",
    heure: "08h00",
    frequence: "hebdomadaire",
    noteChaufeur: "Sonner à l'interphone, portail bleu",
    statut: "confirmée",
    chauffeur: "Tasse Arole",
  },
  {
    id: "cv2",
    date: "2024-04-01",
    heure: "08h00",
    frequence: "hebdomadaire",
    noteChaufeur: "Sonner à l'interphone, portail bleu",
    statut: "planifiée",
    chauffeur: null,
  },
  {
    id: "cv3",
    date: "2024-03-18",
    heure: "09h30",
    frequence: "ponctuelle",
    noteChaufeur: "",
    statut: "effectuée",
    chauffeur: "Negou Donald",
  },
  {
    id: "cv4",
    date: "2024-03-11",
    heure: "09h30",
    frequence: "ponctuelle",
    noteChaufeur: "",
    statut: "effectuée",
    chauffeur: "Tasse Arole",
  },
];

const mockOffres = [
  {
    id: "v1",
    titre: "Collecte Express",
    description: "Collecte à la demande en moins de 2h, 7j/7",
    prix: "5 000 FCFA / collecte",
    icone: "⚡",
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
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const FREQUENCES = [
  { value: "ponctuelle",    label: "Ponctuelle",       desc: "Une seule collecte" },
  { value: "hebdomadaire",  label: "Hebdomadaire",     desc: "Chaque semaine" },
  { value: "bihebdomadaire",label: "Bi-hebdomadaire",  desc: "2 fois par semaine" },
  { value: "mensuelle",     label: "Mensuelle",        desc: "1 fois par mois" },
];

const HORAIRES = ["07h00","08h00","09h00","10h00","11h00","14h00","15h00","16h00","17h00"];

const STATUT_CONFIG = {
  confirmée: {
    label: "Confirmée",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500"
  },
  planifiée: {
    label: "Planifiée",
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-600"
  },
  effectuée: {
    label: "Effectuée",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500"
  },
  annulée: {
    label: "Annulée",
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400"
  },
};

// ─── MUR D'UPGRADE ────────────────────────────────────────────────────────────

function UpgradeWall({ onUpgrade }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">

        {/* Carte principale */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Bandeau haut */}
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <Star key={i} size={40} className="absolute text-white"
                  style={{ top: `${Math.random()*80}%`, left: `${Math.random()*90}%`, opacity: .4 }} />
              ))}
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-white" />
              </div>
              <h1 className="text-xl font-black text-white mb-1">Accès réservé aux membres VIP</h1>
              <p className="text-sm text-yellow-100">
                Programmez vos collectes à la demande avec notre service premium
              </p>
            </div>
          </div>

          {/* Avantages */}
          <div className="px-8 py-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
              Ce que vous obtenez avec un abonnement VIP
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                "Collectes programmées à la date et l'heure de votre choix",
                "Collectes prioritaires — passez avant la file standard",
                "Fréquence personnalisée : hebdo, bi-hebdo ou mensuelle",
                "Notes directement transmises au chauffeur",
                "Historique complet de vos collectes",
                "Support dédié 7j/7",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            {/* Offres */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Choisissez votre offre
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {mockOffres.map((offre) => (
                <button
                  key={offre.id}
                  onClick={() => onUpgrade(offre)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition hover:border-green-400 hover:bg-green-50 group ${
                    offre.populaire
                      ? "border-green-400 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-xl">{offre.icone}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{offre.titre}</span>
                      {offre.populaire && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">
                          Populaire
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{offre.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-green-700">{offre.prix}</p>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 transition ml-auto mt-1" />
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Paiement sécurisé · Résiliation à tout moment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL DE CONFIRMATION ANNULATION ────────────────────────────────────────

function ModalAnnulation({ collecte, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={18} />
          </button>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Annuler cette collecte ?</h3>
        <p className="text-sm text-gray-500 mb-2">
          La collecte du{" "}
          <strong className="text-gray-800">
            {new Date(collecte.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })} à {collecte.heure}
          </strong>{" "}
          sera définitivement annulée.
        </p>
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-5">
          ⚠️ Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Conserver
          </button>
          <button onClick={() => onConfirm(collecte.id)}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition">
            Annuler la collecte
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function CollecteVIP() {
  const router  = useRouter();
  const citoyen = mockCitoyen;

  const [collectes, setCollectes]       = useState(mockCollectesVIP);
  const [showForm, setShowForm]         = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [toAnnuler, setToAnnuler]       = useState(null);
  const [onglet, setOnglet]             = useState("a_venir"); // "a_venir" | "historique"

  // Form state
  const [date, setDate]                   = useState("");
  const [heure, setHeure]                 = useState("08h00");
  const [frequence, setFrequence]         = useState("ponctuelle");
  const [noteChaufeur, setNoteChaufeur]   = useState("");
  const [errors, setErrors]               = useState({});

  // Upgrade
  const [upgradeChoisi, setUpgradeChoisi] = useState(null);

  // ─── Mur upgrade ────────────────────────────────────────────────────────────
  if (citoyen.abonnement !== "vip") {
    if (upgradeChoisi) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Demande reçue !</h2>
            <p className="text-sm text-gray-500 mb-4">
              Votre demande d'abonnement <strong>{upgradeChoisi.titre}</strong> a été enregistrée.
              Notre équipe vous contactera sous 24h pour finaliser votre inscription VIP.
            </p>
          </div>
        </div>
      );
    }
    return <UpgradeWall onUpgrade={setUpgradeChoisi} />;
  }

  // ─── Validation formulaire ───────────────────────────────────────────────────
  const valider = () => {
    const errs = {};
    if (!date) errs.date = "Veuillez choisir une date.";
    else {
      const chosen = new Date(date);
      const today  = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) errs.date = "La date doit être aujourd'hui ou dans le futur.";
    }
    if (!heure) errs.heure = "Choisissez un horaire.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Soumission ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!valider()) return;
    setLoading(true);

    // await fetch("/api/collectes-vip", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ citoyenId: citoyen.id, date, heure, frequence, noteChaufeur }),
    // });

    await new Promise((r) => setTimeout(r, 1200));

    const nouvelle = {
      id: `cv${Date.now()}`,
      date, heure, frequence, noteChaufeur,
      statut: "planifiée",
      chauffeur: null,
    };
    setCollectes((prev) => [nouvelle, ...prev]);
    setLoading(false);
    setSubmitted(true);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setDate(""); setHeure("08h00");
    setFrequence("ponctuelle"); setNoteChaufeur("");
    setErrors({});
  };

  // ─── Annulation ──────────────────────────────────────────────────────────────
  const handleAnnuler = async (id) => {
    // await fetch(`/api/collectes-vip/${id}`, { method: "DELETE" });
    setCollectes((prev) =>
      prev.map((c) => c.id === id ? { ...c, statut: "annulée" } : c)
    );
    setToAnnuler(null);
  };

  // ─── Listes filtrées ─────────────────────────────────────────────────────────
  const aVenir    = collectes.filter((c) => ["planifiée","confirmée"].includes(c.statut));
  const historique = collectes.filter((c) => ["effectuée","annulée"].includes(c.statut));
  const liste     = onglet === "a_venir" ? aVenir : historique;

  const today = new Date().toISOString().split("T")[0];
  const freqChoisie = FREQUENCES.find((f) => f.value === frequence);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* MODAL ANNULATION */}
      {toAnnuler && (
        <ModalAnnulation
          collecte={toAnnuler}
          onConfirm={handleAnnuler}
          onClose={() => setToAnnuler(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">

        {/* EN-TÊTE */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">

  <div className="flex items-center gap-4">

    <div className="w-12 h-12 bg-green-700 rounded-2xl flex items-center justify-center shadow-sm">
      <Star size={20} className="text-white" />
    </div>

    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-black text-gray-900">
          Collecte VIP
        </h1>

        <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <CheckCircle size={12} />
          Actif
        </span>
      </div>

      <p className="text-sm text-gray-400 mt-0.5">
        {citoyen.adresse}
      </p>
    </div>
  </div>

  {!showForm && (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition shadow-sm"
    >
      <Plus size={16} />
      Nouvelle collecte
    </button>
  )}
</div>

      <div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
    <Calendar size={18} className="text-green-600" />
    <div>
      <p className="text-xs text-gray-400">À venir</p>
      <p className="font-bold text-gray-900">{aVenir.length}</p>
    </div>
  </div>

  <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
    <CheckCircle size={18} className="text-green-600" />
    <div>
      <p className="text-xs text-gray-400">Effectuées</p>
      <p className="font-bold text-gray-900">{historique.filter(c => c.statut==="effectuée").length}</p>
    </div>
  </div>

  <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
    <RefreshCw size={18} className="text-green-600" />
    <div>
      <p className="text-xs text-gray-400">Fréquence</p>
      <p className="font-bold text-gray-900 capitalize">{frequence}</p>
    </div>
  </div>

</div>

        {/* BANDEAU SUCCÈS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-base font-bold text-gray-900">
        Programmer une collecte
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Choisissez une date, une heure et une fréquence
      </p>
    </div>

    <button
      onClick={() => { setShowForm(false); resetForm(); }}
      className="text-gray-400 hover:text-gray-600 transition"
    >
      <X size={18} />
    </button>
  </div>

  <div className="flex flex-col gap-6">

    {/* ───────── DATE + HEURE ───────── */}
    <div className="grid grid-cols-2 gap-4">

      {/* DATE */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
          Date
        </label>

        <div className="relative">
          <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />

          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition
              ${errors.date
                ? "border-red-300 bg-red-50"
                : "border-gray-200 focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
              }`}
          />
        </div>

        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date}</p>
        )}
      </div>

      {/* HEURE */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
          Horaire
        </label>

        <div className="relative">
          <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" />

          <select
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
          >
            {HORAIRES.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

    </div>

    {/* ───────── FREQUENCE (VERSION AMÉLIORÉE) ───────── */}
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
        Fréquence
      </label>

      <div className="grid grid-cols-2 gap-3">
        {FREQUENCES.map((f) => (
          <button
            key={f.value}
            onClick={() => setFrequence(f.value)}
            className={`p-4 rounded-xl border transition text-left group
              ${frequence === f.value
                ? "border-green-500 bg-green-50 shadow-sm"
                : "border-gray-200 hover:border-green-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <RefreshCw
                size={16}
                className={frequence === f.value ? "text-green-600" : "text-gray-400"}
              />

              <div>
                <p className={`text-sm font-bold ${
                  frequence === f.value ? "text-green-800" : "text-gray-700"
                }`}>
                  {f.label}
                </p>

                <p className="text-xs text-gray-400">
                  {f.desc}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* INFO INTELLIGENTE */}
      {frequence !== "ponctuelle" && (
        <div className="mt-3 text-xs bg-green-50 border border-green-100 text-green-800 rounded-lg px-3 py-2">
          📅 Reprogrammation automatique activée
        </div>
      )}
    </div>

    {/* ───────── NOTE CHAUFFEUR ───────── */}
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
        Instructions pour le chauffeur
      </label>

      <div className="relative">
        <MessageSquare size={14} className="absolute left-3 top-3 text-green-600" />

        <textarea
          value={noteChaufeur}
          onChange={(e) => setNoteChaufeur(e.target.value)}
          placeholder="Ex : portail fermé, sonner..."
          rows={2}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
        />
      </div>

      <p className="text-xs text-gray-400 text-right mt-1">
        {noteChaufeur.length}/200
      </p>
    </div>

    {/* ───────── RÉCAP PREMIUM ───────── */}
    {date && heure && (
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl px-4 py-3 text-sm">
        <p className="text-xs opacity-80">Résumé</p>

        <p className="font-bold mt-1">
          {new Date(date).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })} à {heure}
        </p>

        <p className="text-xs opacity-80 mt-1 capitalize">
          {frequence}
        </p>
      </div>
    )}

    {/* ───────── ACTIONS ───────── */}
    <div className="flex gap-3 pt-2">

      <button
        onClick={() => { setShowForm(false); resetForm(); }}
        className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
      >
        Annuler
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="flex-1 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition flex items-center justify-center gap-2"
      >
        {loading ? "..." : (
          <>
            <CheckCircle size={16} />
            Confirmer
          </>
        )}
      </button>

    </div>

  </div>
</div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-800 font-medium">
  ✔ Service VIP actif — votre collecte sera prioritaire
</div>

        {/* ── LISTE DES COLLECTES ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Onglets */}
          <div className="flex border-b border-gray-100">
            {[
              { key: "a_venir",    label: "À venir",   count: aVenir.length },
              { key: "historique", label: "Historique", count: historique.length },
            ].map((o) => (
              <button key={o.key} onClick={() => setOnglet(o.key)}
                className={`flex-1 py-4 text-sm font-bold transition border-b-2 ${
                  onglet === o.key
                    ? "text-green-700 border-green-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {o.label}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                  onglet === o.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>{o.count}</span>
              </button>
            ))}
          </div>

          {/* Corps */}
          {liste.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <Calendar size={36} className="text-green-200" />
              <p className="text-sm font-semibold">
                {onglet === "a_venir"
                  ? "Aucune collecte programmée"
                  : "Aucun historique disponible"}
              </p>
              {onglet === "a_venir" && (
                <button onClick={() => setShowForm(true)}
                  className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1">
                  <Plus size={14} /> Programmer ma première collecte
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {liste.map((c) => {
                const cfg = STATUT_CONFIG[c.statut] || STATUT_CONFIG.planifiée;
                const peutAnnuler = ["planifiée", "confirmée"].includes(c.statut);
                const freqLabel = FREQUENCES.find((f) => f.value === c.frequence)?.label || c.frequence;

                return (
                  <div key={c.id} className="px-6 py-4 flex items-start gap-4 hover:bg-green-50/40 transition border-l-4 border-transparent hover:border-green-500">
                    {/* Icône date */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="bg-green-50 border border-green-100 rounded-xl py-1.5">
                        <p className="text-xs font-bold text-green-600 uppercase">
                          {new Date(c.date).toLocaleDateString("fr-FR", { month: "short" })}
                        </p>
                        <p className="text-lg font-black text-green-800 leading-none">
                          {new Date(c.date).getDate().toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(c.date).toLocaleDateString("fr-FR", {
                            weekday: "long", day: "numeric", month: "long",
                          })}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {c.heure}
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw size={11} /> {freqLabel}
                        </span>
                        {c.chauffeur && (
                          <span className="flex items-center gap-1 text-green-700 font-semibold">
                            👤 {c.chauffeur}
                          </span>
                        )}
                      </div>

                      {c.noteChaufeur && (
                        <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                          <MessageSquare size={11} className="flex-shrink-0 mt-0.5" />
                          {c.noteChaufeur}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {peutAnnuler && (
                      <button
                        onClick={() => setToAnnuler(c)}
                        title="Annuler cette collecte"
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}