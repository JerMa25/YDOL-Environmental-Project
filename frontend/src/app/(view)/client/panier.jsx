"use client";

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────
// GET  /api/boutique/commandes?citoyenId=:id  → historique commandes
// GET  /api/boutique/commandes/:id            → détail commande
// POST /api/boutique/commandes                → passer commande
//   Body: { citoyenId, items: [{ produitId, quantite }], adresseLivraison, modePaiement }

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingCart, Trash2, Plus, Minus,
  CheckCircle, Package, MapPin, CreditCard,
  ChevronRight, X, AlertTriangle, Clock, Truck
} from "lucide-react";
import { commandesMock, STATUT_COMMANDE } from "./mockBoutique";

// ─── MOCK PANIER INITIAL (en prod : context/store global) ─────────────────────
const panierInitial = [
  { id: 1,  nom: "Granulés plastique HDPE recyclé", emoji: "♻️", prix: 1200, unite: "kg",       quantite: 15, stock: 450, minCommande: 10, couleur: "bg-blue-50"  },
  { id: 5,  nom: "Compost mûr certifié",             emoji: "🌱", prix: 450,  unite: "kg",       quantite: 20, stock: 600, minCommande: 5,  couleur: "bg-green-50" },
  { id: 6,  nom: "Vers de compost",                  emoji: "🪱", prix: 8000, unite: "lot 500g", quantite: 3,  stock: 40,  minCommande: 1,  couleur: "bg-green-50" },
];

const MODES_PAIEMENT = [
  { id: "mobile_money",  label: "Mobile Money",      icon: "📱" },
  { id: "virement",      label: "Virement bancaire", icon: "🏦" },
  { id: "cash",          label: "Paiement à la livraison", icon: "💵" },
];

// ─── MODAL DÉTAIL COMMANDE ────────────────────────────────────────────────────

function ModalCommande({ commande, onClose }) {
  const cfg = STATUT_COMMANDE[commande.statut] || STATUT_COMMANDE.confirmée;
  const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const steps = [
    { label: "Commande confirmée", done: true,
      desc: `Le ${fmt(commande.date)}` },
    { label: "En préparation",     done: ["en_cours","livrée"].includes(commande.statut),
      desc: "Centre de collecte" },
    { label: "En livraison",       done: ["en_cours","livrée"].includes(commande.statut),
      desc: commande.statut === "en_cours" ? "En cours…" : "Expédié" },
    { label: "Livrée",             done: commande.statut === "livrée",
      desc: commande.statut === "livrée" ? "Livraison effectuée" : "En attente" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-base font-black text-gray-900">{commande.id}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Commandé le {fmt(commande.date)}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition text-gray-400">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Statut */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${cfg.bg}`}>
            <span className="text-xl">{cfg.icon}</span>
            <div>
              <p className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {commande.statut === "en_cours" ? "Votre commande est en route" :
                 commande.statut === "livrée"   ? "Livraison effectuée avec succès" :
                 commande.statut === "confirmée" ? "Votre commande est confirmée" :
                 "Commande annulée"}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Suivi</p>
            <div className="flex flex-col gap-0">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      s.done ? "bg-green-600" : "bg-gray-100"
                    }`}>
                      {s.done
                        ? <CheckCircle size={14} className="text-white" />
                        : <div className="w-2 h-2 rounded-full bg-gray-300" />
                      }
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${s.done ? "bg-green-200" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-semibold ${s.done ? "text-gray-900" : "text-gray-400"}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Articles ({commande.items.length})
            </p>
            <div className="flex flex-col gap-2">
              {commande.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.nom}</p>
                    <p className="text-xs text-gray-400">
                      {item.quantite} {item.unite} × {item.prixUnitaire.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <p className="text-sm font-black text-green-700 flex-shrink-0">
                    {(item.quantite * item.prixUnitaire).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Infos livraison */}
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
            <div className="px-4 py-3 flex items-start gap-3">
              <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Adresse de livraison</p>
                <p className="text-sm text-gray-700 mt-0.5">{commande.adresseLivraison}</p>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <CreditCard size={14} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mode de paiement</p>
                <p className="text-sm text-gray-700 mt-0.5">{commande.modePaiement}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-5 py-4">
            <span className="text-sm font-bold text-green-800">Total de la commande</span>
            <span className="text-xl font-black text-green-700">
              {commande.total.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL CONFIRMATION ACHAT ─────────────────────────────────────────────────

function ModalCheckout({ items, total, onConfirm, onClose }) {
  const [adresse, setAdresse]   = useState("Rue des Palmiers Nr 12, Bastos, Yaoundé");
  const [paiement, setPaiement] = useState("mobile_money");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const handleConfirm = async () => {
    const errs = {};
    if (!adresse.trim()) errs.adresse = "Adresse requise";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onConfirm({ adresse, paiement });
  };

  const modeLabel = MODES_PAIEMENT.find(m => m.id === paiement)?.label;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900">Finaliser la commande</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Récap articles */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Récapitulatif</p>
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <span>{item.emoji}</span>
                    <span className="truncate max-w-[160px]">{item.nom}</span>
                  </span>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    {(item.quantite * item.prix).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
              Adresse de livraison <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
              <textarea
                value={adresse}
                onChange={e => setAdresse(e.target.value)}
                rows={2}
                className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition ${
                  errors.adresse ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.adresse && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={11} /> {errors.adresse}
              </p>
            )}
          </div>

          {/* Mode paiement */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Mode de paiement</p>
            <div className="flex flex-col gap-2">
              {MODES_PAIEMENT.map((m) => (
                <button key={m.id} onClick={() => setPaiement(m.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                    paiement === m.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className={`text-sm font-semibold ${paiement === m.id ? "text-green-800" : "text-gray-700"}`}>
                    {m.label}
                  </span>
                  {paiement === m.id && <CheckCircle size={16} className="ml-auto text-green-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-5 py-4">
            <span className="text-sm font-bold text-green-800">Total</span>
            <span className="text-xl font-black text-green-700">
              {total.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleConfirm} disabled={loading}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg> Traitement…</>
              ) : (
                <><CreditCard size={15} /> Confirmer ({modeLabel})</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PANIER ──────────────────────────────────────────────────────────────

export default function Panier() {
  const router = useRouter();

  const [panier, setPanier]               = useState(panierInitial);
  const [commandes, setCommandes]         = useState(commandesMock);
  const [onglet, setOnglet]               = useState("panier"); // "panier" | "commandes"
  const [commandeDetail, setCommandeDetail] = useState(null);
  const [showCheckout, setShowCheckout]   = useState(false);
  const [commandeSuccess, setCommandeSuccess] = useState(null);

  // ─── Panier ───────────────────────────────────────────────────────────────

  const updateQte = (id, delta) => {
    setPanier(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQte = Math.max(i.minCommande, Math.min(i.stock, i.quantite + delta));
      return { ...i, quantite: newQte };
    }));
  };

  const supprimerItem = (id) => {
    setPanier(prev => prev.filter(i => i.id !== id));
  };

  const totalPanier = panier.reduce((s, i) => s + i.prix * i.quantite, 0);

  // ─── Commande ─────────────────────────────────────────────────────────────

  const handleCommande = ({ adresse, paiement }) => {
    const modeLabel = MODES_PAIEMENT.find(m => m.id === paiement)?.label || paiement;
    const nouvCmd = {
      id: `CMD-2024-00${commandes.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      statut: "confirmée",
      total: totalPanier,
      adresseLivraison: adresse,
      modePaiement: modeLabel,
      items: panier.map(i => ({
        produitId: i.id,
        nom: i.nom,
        quantite: i.quantite,
        prixUnitaire: i.prix,
        unite: i.unite,
        emoji: i.emoji,
      })),
    };
    setCommandes(prev => [nouvCmd, ...prev]);
    setCommandeSuccess(nouvCmd);
    setPanier([]);
    setShowCheckout(false);
    setOnglet("commandes");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MODAL DÉTAIL COMMANDE */}
      {commandeDetail && (
        <ModalCommande commande={commandeDetail} onClose={() => setCommandeDetail(null)} />
      )}

      {/* MODAL CHECKOUT */}
      {showCheckout && (
        <ModalCheckout
          items={panier}
          total={totalPanier}
          onConfirm={handleCommande}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-green-700 transition group flex items-center gap-1.5 text-sm font-semibold">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Boutique
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-base font-black text-gray-900 flex items-center gap-2">
            <ShoppingCart size={18} className="text-green-600" />
            Mon espace achats
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ONGLETS */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { key: "panier",    label: "Panier",     count: panier.length,    icon: <ShoppingCart size={14}/> },
            { key: "commandes", label: "Mes achats", count: commandes.length, icon: <Package size={14}/> },
          ].map(o => (
            <button key={o.key} onClick={() => setOnglet(o.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
                onglet === o.key
                  ? "text-green-700 border-green-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {o.icon}
              {o.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                onglet === o.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>{o.count}</span>
            </button>
          ))}
        </div>

        {/* ── ONGLET PANIER ──────────────────────────────────────────────── */}
        {onglet === "panier" && (
          <>
            {commandeSuccess && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-5">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-800">Commande {commandeSuccess.id} confirmée !</p>
                  <p className="text-xs text-green-600 mt-0.5">Vous pouvez suivre votre livraison dans "Mes achats".</p>
                </div>
                <button onClick={() => setCommandeSuccess(null)} className="ml-auto text-green-400 hover:text-green-600 transition">
                  <X size={14} />
                </button>
              </div>
            )}

            {panier.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 text-gray-400">
                <ShoppingCart size={48} className="text-gray-200" />
                <p className="text-base font-bold">Votre panier est vide</p>
                <button onClick={() => router.push("/boutique")}
                  className="flex items-center gap-2 text-sm text-green-600 font-bold hover:underline">
                  Voir les produits <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">

                {/* Articles */}
                {panier.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className={`w-14 h-14 ${item.couleur} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.nom}</p>
                      <p className="text-xs text-green-700 font-bold mt-0.5">
                        {item.prix.toLocaleString("fr-FR")} FCFA / {item.unite}
                      </p>
                      {/* Contrôles quantité */}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQte(item.id, -item.minCommande)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-gray-600">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-black text-gray-900 min-w-[40px] text-center">
                          {item.quantite} {item.unite}
                        </span>
                        <button onClick={() => updateQte(item.id, item.minCommande)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-gray-600">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      <p className="text-base font-black text-green-700">
                        {(item.prix * item.quantite).toLocaleString("fr-FR")} FCFA
                      </p>
                      <button onClick={() => supprimerItem(item.id)}
                        className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Résumé & commander */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col gap-2 mb-4">
                    {panier.map(i => (
                      <div key={i.id} className="flex justify-between text-sm text-gray-600">
                        <span className="truncate max-w-[200px]">{i.emoji} {i.nom} × {i.quantite}</span>
                        <span className="font-semibold">{(i.prix * i.quantite).toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-green-700">
                      {totalPanier.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <button onClick={() => setShowCheckout(true)}
                    className="w-full mt-4 py-4 bg-green-600 text-white rounded-xl font-black text-sm hover:bg-green-700 transition active:scale-[.98] flex items-center justify-center gap-2">
                    <CreditCard size={16} />
                    Passer la commande
                  </button>
                  <button onClick={() => router.push("/boutique")}
                    className="w-full mt-2 py-3 text-sm text-gray-500 font-semibold hover:text-green-700 transition flex items-center justify-center gap-1">
                    Continuer mes achats <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ONGLET MES ACHATS ──────────────────────────────────────────── */}
        {onglet === "commandes" && (
          <>
            {commandes.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 text-gray-400">
                <Package size={48} className="text-gray-200" />
                <p className="text-base font-bold">Aucune commande pour l'instant</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {commandes.map((cmd) => {
                  const cfg = STATUT_COMMANDE[cmd.statut] || STATUT_COMMANDE.confirmée;
                  const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "short", year: "numeric",
                  });
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => setCommandeDetail(cmd)}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-left w-full group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-black text-gray-900 group-hover:text-green-700 transition-colors">
                            {cmd.id}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock size={10} /> {fmt(cmd.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                        </div>
                      </div>

                      {/* Articles résumé */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {cmd.items.map((item, i) => (
                          <span key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 text-xs text-gray-600 font-medium">
                            <span>{item.emoji}</span>
                            {item.nom.length > 20 ? item.nom.slice(0, 20) + "…" : item.nom}
                            <span className="text-gray-400">× {item.quantite}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {cmd.adresseLivraison.length > 35
                            ? cmd.adresseLivraison.slice(0, 35) + "…"
                            : cmd.adresseLivraison}
                        </p>
                        <p className="text-base font-black text-green-700">
                          {cmd.total.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
