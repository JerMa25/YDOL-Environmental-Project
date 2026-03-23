"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, User, Trash2, Activity, Droplets } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ─── ENDPOINT (à brancher plus tard) ─────────────────────────────────────────
// GET /api/garbage-bins/:id   → détails complets du bac
// GET /api/garbage-bins/:id/historique → historique des vidages

// ─── MOCK DATA (même données que la liste) ────────────────────────────────────

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
    description: "Bac principal du quartier Bastos, zone résidentielle haute densité.",
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
    description: "Bac recyclable situé près du marché central d'Emana.",
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
    description: "Grand bac zone commerciale Akwa, collecte quotidienne.",
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
    description: "Bac organique situé à proximité du stade de Nlongkak.",
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
    description: "Bac en maintenance suite à un dommage sur le couvercle.",
  },
];

const historiquesMock = {
  1: [
    { date: "2024-03-18", chauffeur: "Tasse Arole",    heure: "09h45", remplissageAvant: 82, statut: "Effectué" },
    { date: "2024-03-11", chauffeur: "Tasse Arole",    heure: "10h10", remplissageAvant: 79, statut: "Effectué" },
    { date: "2024-03-04", chauffeur: "Negou Donald",   heure: "09h30", remplissageAvant: 91, statut: "Effectué" },
    { date: "2024-02-26", chauffeur: "Tasse Arole",    heure: "10h00", remplissageAvant: 75, statut: "Effectué" },
    { date: "2024-02-19", chauffeur: "Tasse Arole",    heure: "11h15", remplissageAvant: 88, statut: "Retard" },
  ],
  2: [
    { date: "2024-03-15", chauffeur: "Negou Donald",   heure: "08h20", remplissageAvant: 97, statut: "Effectué" },
    { date: "2024-03-08", chauffeur: "Negou Donald",   heure: "09h05", remplissageAvant: 85, statut: "Effectué" },
  ],
  3: [
    { date: "2024-03-19", chauffeur: "Rouchda Yampen", heure: "07h50", remplissageAvant: 68, statut: "Effectué" },
    { date: "2024-03-12", chauffeur: "Rouchda Yampen", heure: "08h10", remplissageAvant: 74, statut: "Effectué" },
    { date: "2024-03-05", chauffeur: "Rouchda Yampen", heure: "07h40", remplissageAvant: 80, statut: "Effectué" },
  ],
  4: [
    { date: "2024-03-20", chauffeur: "Tasse Arole",    heure: "10h30", remplissageAvant: 55, statut: "Effectué" },
  ],
  5: [
    { date: "2024-03-10", chauffeur: "Rouchda Yampen", heure: "09h00", remplissageAvant: 72, statut: "Maintenance" },
  ],
};

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const STATUT_CONFIG = {
  ACTIF:       { label: "Actif",       bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500",  icon: "✅" },
  PLEIN:       { label: "Plein",       bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500",    icon: "🔴" },
  MAINTENANCE: { label: "Maintenance", bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500",  icon: "🔧" },
  INACTIF:     { label: "Inactif",     bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400",   icon: "⚫" },
};

const TYPE_COLORS = {
  "Organique":   "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Recyclable":  "bg-blue-50 text-blue-700 border-blue-200",
  "Tout venant": "bg-slate-50 text-slate-700 border-slate-200",
};

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function RemplissageGauge({ value }) {
  const color =
    value >= 90 ? "#ef4444" :
    value >= 70 ? "#f59e0b" :
    "#22c55e";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={128} height={128} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={64} cy={64} r={r} fill="none" stroke="#f3f4f6" strokeWidth={10} />
          <circle cx={64} cy={64} r={r} fill="none" stroke={color} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{value}%</span>
          <span className="text-xs text-gray-400 font-medium">rempli</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium">
        {value >= 90 ? "🔴 Urgent — vidage requis" :
         value >= 70 ? "🟡 Bientôt plein" :
         "🟢 Niveau normal"}
      </p>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function GarbageBinDetail() {
  const params  = useParams();
  const router  = useRouter();
  const binId   = parseInt(params.id, 10);

  // En production : fetch(`/api/garbage-bins/${binId}`)
  const bin         = binsMock.find((b) => b.id === binId);
  const historique  = historiquesMock[binId] || [];

  if (!bin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Trash2 size={48} className="text-gray-300" />
        <h2 className="text-lg font-bold text-gray-600">Bac introuvable</h2>
        <Link href="/admin/garbage-bins"
          className="flex items-center gap-2 text-sm text-green-600 font-semibold hover:underline">
          <ArrowLeft size={16} /> Retour à la liste
        </Link>
      </div>
    );
  }

  const statut = STATUT_CONFIG[bin.statut] || STATUT_CONFIG.INACTIF;

  const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* BOUTON RETOUR */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold mb-6 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        Retour à la liste
      </button>

      {/* EN-TÊTE */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            🗑️
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{bin.code}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              📍 {bin.adresse}, {bin.district} — {bin.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full ${statut.bg} ${statut.text}`}>
            <span className={`w-2 h-2 rounded-full ${statut.dot}`} />
            {statut.label}
          </span>
          <Link
            href={`/admin/garbage-bins/${bin.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-100 transition"
          >
            <EditIcon fontSize="small" /> Modifier
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition">
            <DeleteIcon fontSize="small" /> Archiver
          </button>
        </div>
      </div>

      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-3 gap-5">

        {/* ── Colonne gauche : jauges + infos ──────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Jauge remplissage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Taux de remplissage</p>
            <RemplissageGauge value={bin.tauxRemplissage} />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Capacité totale : <strong className="text-gray-700">{bin.capacite} L</strong>
            </p>
          </div>

          {/* Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Type de bac</p>
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${TYPE_COLORS[bin.type] || TYPE_COLORS["Tout venant"]}`}>
              {bin.type}
            </span>
            {bin.description && (
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{bin.description}</p>
            )}
          </div>
        </div>

        {/* ── Colonne centre : informations détaillées ──────────────────────── */}
        <div className="flex flex-col gap-5">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Localisation</p>

            <InfoRow
              icon={<MapPin size={15} />}
              label="Adresse complète"
              value={`${bin.adresse}, ${bin.district}`}
            />
            <InfoRow
              icon={<MapPin size={15} />}
              label="Ville"
              value={bin.city}
            />
            <InfoRow
              icon={<Activity size={15} />}
              label="Site de collecte"
              value={bin.site}
            />
            <InfoRow
              icon={<MapPin size={15} />}
              label="Coordonnées GPS"
              value={`${bin.latitude}, ${bin.longitude}`}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Collecte</p>

            <InfoRow
              icon={<User size={15} />}
              label="Chauffeur assigné"
              value={bin.chauffeurAssigne}
            />
            <InfoRow
              icon={<Calendar size={15} />}
              label="Dernier vidage"
              value={fmt(bin.dernierVidege)}
            />
            <InfoRow
              icon={<Calendar size={15} />}
              label="Prochain vidage"
              value={fmt(bin.prochainVidege)}
            />
          </div>
        </div>

        {/* ── Colonne droite : dates + historique ──────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Dates système */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Informations système</p>
            <InfoRow icon={<Calendar size={15} />} label="Créé le" value={fmt(bin.created_at)} />
            <InfoRow icon={<Calendar size={15} />} label="Mis à jour le" value={fmt(bin.updated_at)} />
          </div>

          {/* Historique des vidages */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Historique des vidages
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{historique.length} entrée{historique.length > 1 ? "s" : ""}</p>
            </div>

            {historique.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Aucun historique disponible</div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {historique.map((h, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      h.statut === "Effectué" ? "bg-green-500" :
                      h.statut === "Retard"   ? "bg-amber-500" : "bg-gray-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">
                        {new Date(h.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        <span className="text-gray-400 font-normal ml-1">à {h.heure}</span>
                      </p>
                      <p className="text-xs text-gray-400 truncate">{h.chauffeur}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-600">{h.remplissageAvant}%</p>
                      <p className={`text-xs font-semibold ${
                        h.statut === "Effectué"   ? "text-green-600" :
                        h.statut === "Retard"     ? "text-amber-600" : "text-gray-500"
                      }`}>{h.statut}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}