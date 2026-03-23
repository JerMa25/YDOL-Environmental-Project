"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, Package, CheckCircle, AlertTriangle, Minus, Plus } from "lucide-react";
import { PRODUITS_MOCK, CATEGORIES, formatPrix } from "@/src/services/data";

// ─── ENDPOINT (à brancher plus tard) ─────────────────────────────────────────
// GET /api/produit/produits/:id

function EtoileNote({ note, nbAvis, grand = false }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={grand ? 18 : 13}
          className={n <= Math.round(note) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
      <span className={`font-bold text-gray-700 ${grand ? "text-base" : "text-xs"}`}>{note}/5</span>
      <span className={`text-gray-400 ${grand ? "text-sm" : "text-xs"}`}>({nbAvis} avis)</span>
    </div>
  );
}

export default function DetailProduitPage() {
  const { id }  = useParams();
  const router  = useRouter();

  // En production : fetch(`/api/produit/produits/${id}`)
  const produit = PRODUITS_MOCK.find(p => p.id === id);

  const [qte, setQte]         = useState(1);
  const [ajoute, setAjoute]   = useState(false);
  const [achete, setAchete]   = useState(false);
  const [loading, setLoading] = useState(false);

  if (!produit) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-base font-bold text-gray-600">Produit introuvable</p>
        <Link href="/produit" className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Retour à la produit
        </Link>
      </div>
    );
  }

  const epuise  = produit.stockDisponible === 0;
  const categorie = CATEGORIES.find(c => c.id === produit.categorie);
  const sousTotal = produit.prix * qte;

  const handleAjouterPanier = () => {
    // En production : ajouter à un contexte/store global de panier
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  };

  const handleAcheterMaintenant = async () => {
    setLoading(true);
    // En production :
    // await fetch("/api/produit/commandes", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     citoyenId: "c001",
    //     items: [{ produitId: produit.id, quantite: qte }],
    //   }),
    // });
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setAchete(true);
  };

  // ─── ÉCRAN SUCCÈS ACHAT ──────────────────────────────────────────────────────
  if (achete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Commande passée !</h2>
          <div className="bg-gray-50 rounded-xl p-4 my-4 flex items-center gap-3 text-left">
            <span className="text-3xl">{produit.image}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{produit.nom}</p>
              <p className="text-xs text-gray-500">{qte} {produit.unite} × {formatPrix(produit.prix)}</p>
              <p className="text-sm font-black text-green-700 mt-0.5">{formatPrix(sousTotal)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Votre commande a été enregistrée. Vous recevrez une confirmation et les détails de livraison très prochainement.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="client/produit/panier"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition text-center block">
              Voir mon panier / commandes
            </Link>
            <Link href="/produit"
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition text-center block">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* RETOUR */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Retour à la produit
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── COLONNE GAUCHE : visuel ──────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl h-72 flex items-center justify-center text-8xl border border-green-100 shadow-sm">
              {produit.image}
            </div>

            {/* Infos vendeur */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Vendeur</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  🏭
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{produit.vendeur}</p>
                  <p className="text-xs text-gray-400">Partenaire certifié Waste Tracker</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLONNE DROITE : infos + achat ──────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Catégorie */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100">
              {categorie?.emoji} {categorie?.label}
            </span>

            {/* Nom */}
            <h1 className="text-2xl font-black text-gray-900 leading-tight">{produit.nom}</h1>

            {/* Note */}
            <EtoileNote note={produit.note} nbAvis={produit.nbAvis} grand />

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">{formatPrix(produit.prix)}</span>
              <span className="text-sm text-gray-400">/ {produit.unite}</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {produit.stockDisponible === 0 ? (
                <span className="flex items-center gap-1.5 text-sm font-bold text-red-600">
                  <AlertTriangle size={15} /> Rupture de stock
                </span>
              ) : produit.stockDisponible <= 20 ? (
                <span className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                  ⚡ Plus que {produit.stockDisponible} {produit.unite} disponible{produit.stockDisponible > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
                  <CheckCircle size={15} /> En stock ({produit.stockDisponible} {produit.unite})
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{produit.description}</p>

            {/* Détails techniques */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Package size={12} /> Détails techniques
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">{produit.details}</p>
            </div>

            {/* Sélecteur quantité */}
            {!epuise && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">Quantité</label>
                  <p className="text-sm font-black text-green-700">
                    Total : {formatPrix(sousTotal)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQte(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                      <Minus size={16} />
                    </button>
                    <span className="w-14 text-center text-base font-black text-gray-900">{qte}</span>
                    <button onClick={() => setQte(q => Math.min(produit.stockDisponible, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">× {formatPrix(produit.prix)} / {produit.unite}</span>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 pt-1">
              <button onClick={handleAcheterMaintenant} disabled={epuise || loading}
                className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Traitement…
                  </>
                ) : epuise ? "Indisponible" : "🛒 Acheter maintenant"}
              </button>

              <button onClick={handleAjouterPanier} disabled={epuise}
                className={`w-full py-3.5 rounded-xl font-bold text-sm border transition flex items-center justify-center gap-2 ${
                  ajoute
                    ? "bg-green-50 border-green-300 text-green-700"
                    : epuise
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-green-600 text-green-700 hover:bg-green-50"
                }`}>
                {ajoute ? <><CheckCircle size={16} /> Ajouté au panier</> : <><ShoppingCart size={16} /> Ajouter au panier</>}
              </button>
            </div>

            {/* Date ajout */}
            <p className="text-xs text-gray-400 text-center">
              Mis en vente le {new Date(produit.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}