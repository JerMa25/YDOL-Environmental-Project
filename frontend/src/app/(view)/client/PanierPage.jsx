"use client";

// ENDPOINTS:
// POST   /api/commandes                        → passer commande
// GET    /api/commandes?citoyenId=:id          → mes commandes
// GET    /api/commandes/:id                    → détail commande
// DELETE /api/commandes/:id                    → annuler commande

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HistoryIcon from "@mui/icons-material/History";
import CancelIcon from "@mui/icons-material/Cancel";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { usePanier } from "@/src/context/PanierContext";
import { COMMANDES_MOCK, STATUT_COMMANDE, calcTotal, formatPrix, FRAIS_LIVRAISON } from "@/src/services/data";

// ─── BADGE STATUT ─────────────────────────────────────────────────────────────
function BadgeStatut({ statut }) {
  const cfg = STATUT_COMMANDE[statut] || STATUT_COMMANDE["en attente"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {cfg.label}
    </span>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
function Timeline({ statut }) {
  const etapes = [
    { key: "en attente", label: "Reçue",        icon: "📋" },
    { key: "en cours",   label: "Préparation",  icon: "📦" },
    { key: "expédié",    label: "En livraison", icon: "🚚" },
    { key: "livré",      label: "Livré",         icon: "✅" },
  ];
  const ordre  = ["en attente","en cours","expédié","livré"];
  const actuel = ordre.indexOf(statut);
  if (actuel === -1) return null; // annulé

  return (
    <div className="flex items-start gap-0 w-full">
      {etapes.map((e, i) => {
        const fait    = ordre.indexOf(e.key) <= actuel;
        const current = e.key === statut;
        return (
          <div key={e.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                fait ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
              } ${current ? "ring-4 ring-green-100 scale-110" : ""}`}>
                {e.icon}
              </div>
              <span className={`text-[10px] font-bold whitespace-nowrap ${fait ? "text-green-700" : "text-gray-400"}`}>
                {e.label}
              </span>
            </div>
            {i < etapes.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all ${
                ordre.indexOf(etapes[i+1].key) <= actuel ? "bg-green-400" : "bg-gray-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MODAL COMMANDE ───────────────────────────────────────────────────────────
function ModalCommande({ items, onClose, onConfirm }) {
  const [adresse, setAdresse] = useState("Rue des Palmiers Nr 12, Bastos, Yaoundé");
  const [paiement, setPaiement] = useState("Mobile Money");
  const [loading, setLoading]   = useState(false);
  const { sousTotal, fraisLivraison, total } = calcTotal(items, FRAIS_LIVRAISON);

  const handleConfirmer = async () => {
    setLoading(true);
    // await fetch("/api/commandes", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     citoyenId: "c001",
    //     items: items.map(i => ({ produitId: i.produitId, quantite: i.quantite })),
    //     adresseLivraison: adresse,
    //     modePaiement: paiement,
    //   }),
    // });
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onConfirm({ adresse, paiement });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ReceiptLongIcon sx={{ fontSize: 22 }} /> Finaliser la commande
          </h2>
          <p className="text-green-100 text-xs mt-0.5">{items.length} article{items.length > 1 ? "s" : ""} · {formatPrix(total)}</p>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Récap articles */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">{item.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.nom}</p>
                  <p className="text-[10px] text-gray-400">{item.quantite} × {formatPrix(item.prixUnit)}</p>
                </div>
                <p className="text-xs font-black text-green-700">{formatPrix(item.prixUnit * item.quantite)}</p>
              </div>
            ))}
          </div>

          {/* Adresse livraison */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <LocationOnIcon sx={{ fontSize: 13 }} /> Adresse de livraison
            </label>
            <input value={adresse} onChange={e => setAdresse(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition" />
          </div>

          {/* Mode paiement */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <CreditCardIcon sx={{ fontSize: 13 }} /> Mode de paiement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Mobile Money", "Carte bancaire", "Virement", "À la livraison"].map(m => (
                <button key={m} onClick={() => setPaiement(m)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    paiement === m
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-semibold">{formatPrix(sousTotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 flex items-center gap-1"><LocalShippingIcon sx={{ fontSize: 13 }} /> Livraison</span>
              <span className="font-semibold">{formatPrix(fraisLivraison)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-green-700 text-base">{formatPrix(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} disabled={loading}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleConfirmer} disabled={loading || !adresse.trim()}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-black hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
              {loading
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Envoi…</>
                : "Confirmer la commande"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DÉTAIL COMMANDE ──────────────────────────────────────────────────────────
function DetailCommande({ commande, onRetour, onAnnuler }) {
  const { sousTotal, fraisLivraison, total } = calcTotal(commande.items, commande.fraisLivraison);
  const peutAnnuler = ["en attente","en cours"].includes(commande.statut);

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onRetour}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold transition group w-fit">
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Retour au panier
      </button>

      {/* En-tête */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-5 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base font-black text-white">{commande.reference}</h2>
              <BadgeStatut statut={commande.statut} />
            </div>
            <p className="text-gray-400 text-xs">
              Passée le {new Date(commande.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          {peutAnnuler && (
            <button onClick={() => onAnnuler(commande.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20 transition border border-red-500/20">
              <CancelIcon sx={{ fontSize: 14 }} /> Annuler
            </button>
          )}
        </div>
        {commande.statut !== "annulé" && (
          <div className="px-6 py-5">
            <Timeline statut={commande.statut} />
          </div>
        )}
        {commande.statut === "annulé" && (
          <div className="px-6 py-4 bg-red-50 flex items-center gap-2 text-sm text-red-700 font-semibold">
            <CancelIcon sx={{ fontSize: 18 }} /> Cette commande a été annulée
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Articles */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">Articles ({commande.items.length})</p>
          </div>
          <div className="divide-y divide-gray-50">
            {commande.items.map((item, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/client/produit/${item.produitId}`}
                    className="text-sm font-bold text-gray-900 hover:text-green-700 transition line-clamp-1">
                    {item.nom}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{item.quantite} {item.unite} × {formatPrix(item.prixUnit)}</p>
                </div>
                <p className="text-sm font-black text-gray-900 flex-shrink-0">{formatPrix(item.prixUnit * item.quantite)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Récapitulatif</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Sous-total</span><span className="font-semibold">{formatPrix(sousTotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500 flex items-center gap-1"><LocalShippingIcon sx={{ fontSize: 13 }} /> Livraison</span><span className="font-semibold">{formatPrix(fraisLivraison)}</span></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-green-700 text-base">{formatPrix(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <LocationOnIcon sx={{ fontSize: 12 }} /> Livraison
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{commande.adresseLivraison}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <CreditCardIcon sx={{ fontSize: 12 }} /> Paiement
            </p>
            <p className="text-sm font-semibold text-gray-700">{commande.modePaiement}</p>
            <p className="text-[11px] text-gray-400 mt-1">Réf. {commande.reference}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PANIER PRINCIPALE ───────────────────────────────────────────────────
export default function PanierPage() {
  const router = useRouter();
  const { items, modifier, supprimer, vider, total, nbItems } = usePanier();

  const [onglet, setOnglet]               = useState("panier"); // "panier" | "en_cours" | "historique"
  const [commandes, setCommandes]         = useState(COMMANDES_MOCK);
  const [commandeActive, setCommandeActive] = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [succes, setSucces]               = useState(null);

  const enCours   = commandes.filter(c => ["en attente","en cours","expédié"].includes(c.statut));
  const historique = commandes.filter(c => ["livré","annulé"].includes(c.statut));

  const handleConfirmerCommande = ({ adresse, paiement }) => {
    const nouvelleCommande = {
      id: `cmd${Date.now()}`,
      reference: `WT-2024-${String(commandes.length + 1).padStart(3,"0")}`,
      date: new Date().toISOString().split("T")[0],
      statut: "en attente",
      items: items.map(i => ({ ...i })),
      adresseLivraison: adresse,
      fraisLivraison: FRAIS_LIVRAISON,
      modePaiement: paiement,
    };
    setCommandes(prev => [nouvelleCommande, ...prev]);
    vider();
    setShowModal(false);
    setSucces(nouvelleCommande);
    setOnglet("en_cours");
  };

  const handleAnnuler = (id) => {
    // await fetch(`/api/commandes/${id}`, { method: "DELETE" });
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: "annulé" } : c));
    setCommandeActive(null);
  };

  // Vue détail commande
  if (commandeActive) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <DetailCommande commande={commandeActive} onRetour={() => setCommandeActive(null)} onAnnuler={handleAnnuler} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8]">
      {showModal && <ModalCommande items={items} onClose={() => setShowModal(false)} onConfirm={handleConfirmerCommande} />}

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold transition group">
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Boutique
        </button>
        <div className="flex items-center gap-2 text-sm font-black text-gray-900">
          <ShoppingCartIcon sx={{ fontSize: 20, color: "#16a34a" }} />
          Mon panier
          {nbItems > 0 && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">{nbItems}</span>}
        </div>
      </div>

      {/* BANDEAU SUCCÈS */}
      {succes && (
        <div className="bg-green-600 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            Commande {succes.reference} passée avec succès !
          </div>
          <button onClick={() => setSucces(null)} className="text-green-200 hover:text-white transition text-lg font-bold">×</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ONGLETS */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 mb-8 shadow-sm">
          {[
            { key: "panier",      label: "Panier",       icon: <ShoppingCartIcon sx={{ fontSize: 16 }} />, count: nbItems },
            { key: "en_cours",    label: "En cours",     icon: <LocalShippingIcon sx={{ fontSize: 16 }} />, count: enCours.length },
            { key: "historique",  label: "Historique",   icon: <HistoryIcon sx={{ fontSize: 16 }} />,      count: historique.length },
          ].map(o => (
            <button key={o.key} onClick={() => setOnglet(o.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                onglet === o.key
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {o.icon} {o.label}
              {o.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  onglet === o.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>{o.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── ONGLET PANIER ─────────────────────────────────────────────────── */}
        {onglet === "panier" && (
          items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShoppingCartIcon sx={{ fontSize: 56, color: "#e5e7eb" }} />
              <p className="text-base font-bold text-gray-500 mt-4">Votre panier est vide</p>
              <p className="text-sm text-gray-400 mt-1 mb-6">Explorez notre marché des recyclables</p>
              <Link href="/client/produit"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-sm">
                <StorefrontIcon sx={{ fontSize: 18 }} /> Découvrir les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Articles */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-bold text-gray-700">{nbItems} article{nbItems > 1 ? "s" : ""} dans votre panier</h2>
                  <button onClick={vider} className="text-xs text-red-500 hover:text-red-700 font-semibold transition">
                    Tout vider
                  </button>
                </div>

                {items.map(item => (
                  <div key={item.produitId}
                    className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-green-200 transition-all">
                    <Link href={`/client/produit/${item.produitId}`}
                      className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-105 transition-transform">
                      {item.image}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/client/produit/${item.produitId}`}
                        className="text-sm font-bold text-gray-900 hover:text-green-700 transition line-clamp-1">
                        {item.nom}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{formatPrix(item.prixUnit)} / {item.unite}</p>
                      <p className="text-sm font-black text-green-700 mt-1">{formatPrix(item.prixUnit * item.quantite)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => modifier(item.produitId, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                          <RemoveIcon sx={{ fontSize: 15 }} />
                        </button>
                        <span className="w-8 text-center text-sm font-black">{item.quantite}</span>
                        <button onClick={() => modifier(item.produitId, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                          <AddIcon sx={{ fontSize: 15 }} />
                        </button>
                      </div>
                      <button onClick={() => supprimer(item.produitId)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition">
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Récap commande */}
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-24">
                  <h3 className="text-sm font-black text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="font-semibold">{formatPrix(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1"><LocalShippingIcon sx={{ fontSize: 13 }} /> Livraison</span>
                      <span className="font-semibold">{formatPrix(FRAIS_LIVRAISON)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                      <span className="font-black text-gray-900">Total</span>
                      <span className="font-black text-green-700 text-lg">{formatPrix(total + FRAIS_LIVRAISON)}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-sm hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/20 active:scale-[.98]">
                    Commander · {formatPrix(total + FRAIS_LIVRAISON)}
                  </button>
                  <Link href="/client/produit"
                    className="block text-center text-xs text-gray-400 hover:text-green-600 font-semibold mt-3 transition">
                    Continuer mes achats →
                  </Link>
                </div>
              </div>
            </div>
          )
        )}

        {/* ── ONGLET EN COURS / HISTORIQUE ────────────────────────────────── */}
        {(onglet === "en_cours" || onglet === "historique") && (() => {
          const liste = onglet === "en_cours" ? enCours : historique;
          return liste.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-dashed border-gray-200">
              {onglet === "en_cours"
                ? <LocalShippingIcon sx={{ fontSize: 56, color: "#e5e7eb" }} />
                : <HistoryIcon sx={{ fontSize: 56, color: "#e5e7eb" }} />}
              <p className="text-base font-bold text-gray-500 mt-4">
                {onglet === "en_cours" ? "Aucune commande en cours" : "Aucun historique"}
              </p>
              <Link href="/client/produit"
                className="text-sm text-green-600 font-bold hover:underline mt-3">
                → Découvrir les produits
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {liste.map(commande => {
                const { total } = calcTotal(commande.items, commande.fraisLivraison);
                return (
                  <button key={commande.id} onClick={() => setCommandeActive(commande)}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:border-green-200 hover:shadow-md transition-all text-left group shadow-sm">
                    <div className="flex -space-x-3 flex-shrink-0">
                      {commande.items.slice(0,3).map((item, i) => (
                        <div key={i} className="w-11 h-11 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-xl border-2 border-white shadow-sm z-10">
                          {item.image}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900">{commande.reference}</span>
                        <BadgeStatut statut={commande.statut} />
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {new Date(commande.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                        {" · "}{commande.items.length} article{commande.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-black text-green-700">{formatPrix(total)}</span>
                      <ChevronRightIcon sx={{ fontSize: 20, color: "#d1d5db" }} className="group-hover:text-green-500 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
