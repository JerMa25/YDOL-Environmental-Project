"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingCart, Package, CheckCircle,
  ChevronRight, X, MapPin, CreditCard, Truck
} from "lucide-react";
import { COMMANDES_MOCK, STATUT_COMMANDE, prixTotal, formatPrix } from "@/src/services/data";

// ─── ENDPOINTS (à brancher plus tard) ────────────────────────────────────────
// GET    /api/boutique/commandes?citoyenId=:id   → mes commandes
// GET    /api/boutique/commandes/:id             → détail commande
// DELETE /api/boutique/commandes/:id             → annuler commande

// ─── BADGE STATUT ─────────────────────────────────────────────────────────────

function BadgeStatut({ statut }) {
  const cfg = STATUT_COMMANDE[statut] || STATUT_COMMANDE["en attente"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── TIMELINE LIVRAISON ───────────────────────────────────────────────────────

function TimelineLivraison({ statut }) {
  const etapes = [
    { key: "en attente", label: "Commande reçue",   icon: "📋" },
    { key: "en cours",   label: "En préparation",   icon: "📦" },
    { key: "expédié",    label: "En livraison",      icon: "🚚" },
    { key: "livré",      label: "Livré",             icon: "✅" },
  ];
  const ordre  = ["en attente", "en cours", "expédié", "livré"];
  const actuel = ordre.indexOf(statut);

  return (
    <div className="flex items-center gap-0">
      {etapes.map((e, i) => {
        const fait    = ordre.indexOf(e.key) <= actuel;
        const current = e.key === statut;
        return (
          <div key={e.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all ${
                fait
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              } ${current ? "ring-4 ring-green-100" : ""}`}>
                {e.icon}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${fait ? "text-green-700" : "text-gray-400"}`}>
                {e.label}
              </span>
            </div>
            {i < etapes.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full ${
                ordre.indexOf(etapes[i + 1].key) <= actuel ? "bg-green-400" : "bg-gray-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DÉTAIL D'UNE COMMANDE ────────────────────────────────────────────────────

function DetailCommande({ commande, onRetour }) {
  const { sousTotal, fraisLivraison, total } = prixTotal(commande.items, commande.fraisLivraison);
  const peutAnnuler = ["en attente", "en cours"].includes(commande.statut);

  return (
    <div>
      {/* Retour */}
      <button onClick={onRetour}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Retour au panier
      </button>

      {/* En-tête commande */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-black text-gray-900">Commande {commande.reference}</h2>
              <BadgeStatut statut={commande.statut} />
            </div>
            <p className="text-sm text-gray-400">
              Passée le {new Date(commande.date).toLocaleDateString("fr-FR", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </p>
          </div>
          {peutAnnuler && (
            <button className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition border border-red-100">
              <X size={13} /> Annuler la commande
            </button>
          )}
        </div>

        {/* Timeline */}
        {commande.statut !== "annulé" && (
          <div className="pt-2">
            <TimelineLivraison statut={commande.statut} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Articles */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">
              Articles commandés ({commande.items.length})
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {commande.items.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/produit/${item.produitId}`}
                    className="text-sm font-bold text-gray-900 hover:text-green-700 transition-colors line-clamp-1">
                    {item.nom}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantite} {item.unite} × {formatPrix(item.prixUnit)}
                  </p>
                </div>
                <p className="text-sm font-black text-gray-900 flex-shrink-0">
                  {formatPrix(item.prixUnit * item.quantite)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé + infos */}
        <div className="flex flex-col gap-4">

          {/* Récap prix */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Récapitulatif</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold text-gray-900">{formatPrix(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1"><Truck size={12} /> Livraison</span>
                <span className="font-semibold text-gray-900">{formatPrix(fraisLivraison)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-green-700 text-base">{formatPrix(total)}</span>
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <MapPin size={11} /> Adresse de livraison
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{commande.adresseLivraison}</p>
          </div>

          {/* Paiement */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <CreditCard size={11} /> Paiement
            </p>
            <p className="text-sm font-semibold text-gray-700">{commande.paiement}</p>
            <p className="text-xs text-gray-400 mt-1">Ref : {commande.reference}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PANIER ──────────────────────────────────────────────────────────────

export default function PanierPage() {
  const router = useRouter();
  const [commandes]             = useState(COMMANDES_MOCK);
  const [commandeActive, setCommandeActive] = useState(null);
  const [onglet, setOnglet]     = useState("commandes"); // "commandes" | "en_cours"

  // Si on visualise une commande en détail
  if (commandeActive) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <DetailCommande
            commande={commandeActive}
            onRetour={() => setCommandeActive(null)}
          />
        </div>
      </div>
    );
  }

  const enCours   = commandes.filter(c => ["en attente","en cours","expédié"].includes(c.statut));
  const historique = commandes.filter(c => ["livré","annulé"].includes(c.statut));
  const liste     = onglet === "en_cours" ? enCours : historique;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* RETOUR */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Retour à la boutique
      </button>

      <div className="max-w-3xl mx-auto">

        {/* EN-TÊTE */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={22} className="text-green-700" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Mes commandes</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {commandes.length} commande{commandes.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>

        {/* ONGLETS */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: "en_cours",   label: "En cours",   count: enCours.length },
              { key: "commandes",  label: "Historique",  count: historique.length },
            ].map(o => (
              <button key={o.key} onClick={() => setOnglet(o.key)}
                className={`flex-1 py-4 text-sm font-bold transition border-b-2 ${
                  onglet === o.key
                    ? "text-green-700 border-green-600"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}>
                {o.label}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                  onglet === o.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>{o.count}</span>
              </button>
            ))}
          </div>

          {/* LISTE */}
          {liste.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <Package size={40} className="text-gray-200" />
              <p className="text-sm font-semibold">
                {onglet === "en_cours" ? "Aucune commande en cours" : "Aucune commande dans l'historique"}
              </p>
              <Link href="/produit"
                className="text-sm text-green-600 font-bold hover:underline">
                → Aller à la boutique
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {liste.map(commande => {
                const { total } = prixTotal(commande.items, commande.fraisLivraison);
                return (
                  <button
                    key={commande.id}
                    onClick={() => setCommandeActive(commande)}
                    className="w-full px-6 py-5 flex items-center gap-4 hover:bg-green-50/40 transition text-left group"
                  >
                    {/* Emojis produits */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      {commande.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center text-lg border-2 border-white shadow-sm">
                          {item.image}
                        </div>
                      ))}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{commande.reference}</span>
                        <BadgeStatut statut={commande.statut} />
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(commande.date).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "long", year: "numeric",
                        })}
                        {" · "}
                        {commande.items.length} article{commande.items.length > 1 ? "s" : ""}
                        {" · "}
                        {commande.items.map(i => i.nom).join(", ").slice(0, 50)}
                        {commande.items.map(i => i.nom).join(", ").length > 50 ? "…" : ""}
                      </p>
                    </div>

                    {/* Total + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-black text-green-700">{formatPrix(total)}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA si historique vide */}
        {liste.length > 0 && (
          <div className="mt-5 text-center">
            <Link href="/produit"
              className="inline-flex items-center gap-2 text-sm text-green-600 font-bold hover:underline">
              <ShoppingCart size={14} /> Continuer mes achats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}