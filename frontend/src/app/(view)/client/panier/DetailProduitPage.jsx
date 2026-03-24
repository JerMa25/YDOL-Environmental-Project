"use client";

// ENDPOINT: GET /api/produits/:id

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { PRODUITS_MOCK, CATEGORIES, formatPrix } from "@/src/services/data";
import { usePanier } from "@/src/context/PanierContext";

function Etoiles({ note, nbAvis }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <StarIcon key={n} sx={{ fontSize: 18, color: n <= Math.round(note) ? "#f59e0b" : "#e5e7eb" }} />
      ))}
      <span className="text-sm font-bold text-gray-700 ml-1">{note}/5</span>
      <span className="text-sm text-gray-400">· {nbAvis} avis</span>
    </div>
  );
}

export default function DetailProduitPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { ajouter, nbItems } = usePanier();

  // En production: const [produit] = await fetch(`/api/produits/${id}`)
  const produit   = PRODUITS_MOCK.find(p => p.id === id);
  const [qte, setQte]         = useState(1);
  const [flashPanier, setFlashPanier] = useState(false);
  const [loading, setLoading] = useState(false);
  const [succes, setSucces]   = useState(false);

  if (!produit) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl opacity-30">😕</span>
        <p className="text-base font-bold text-gray-500">Produit introuvable</p>
        <Link href="/client/produit" className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1">
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Retour à la boutique
        </Link>
      </div>
    );
  }

  const epuise  = produit.stockDisponible === 0;
  const categorie = CATEGORIES.find(c => c.id === produit.categorie);
  const sousTotal = produit.prix * qte;

  const handleAjouterPanier = () => {
    ajouter(produit, qte);
    setFlashPanier(true);
    setTimeout(() => setFlashPanier(false), 2000);
  };

  const handleCommander = async () => {
    // En production :
    // await fetch("/api/commandes", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ citoyenId: "c001", items: [{ produitId: produit.id, quantite: qte }] }),
    // });
    setLoading(true);
    ajouter(produit, qte);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSucces(true);
  };

  // ─── ÉCRAN SUCCÈS ──────────────────────────────────────────────────────────
  if (succes) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon sx={{ fontSize: 44, color: "#16a34a" }} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1">Ajouté au panier !</h2>
          <p className="text-sm text-gray-400 mb-5">Finalisez votre commande depuis votre panier.</p>
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 text-left mb-6 border border-gray-100">
            <span className="text-3xl">{produit.image}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{produit.nom}</p>
              <p className="text-xs text-gray-400">{qte} {produit.unite} · {formatPrix(sousTotal)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/client/produit/panier"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition text-center block">
              Voir mon panier
            </Link>
            <Link href="/client/produit"
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition text-center block">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8]">

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold transition group">
          <ArrowBackIcon sx={{ fontSize: 18 }} className="group-hover:-translate-x-0.5 transition-transform" />
          Boutique
        </button>
        <Link href="/client/produit/panier"
          className="relative flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition">
          <ShoppingCartIcon sx={{ fontSize: 16 }} />
          Panier
          {nbItems > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
              {nbItems}
            </span>
          )}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── GAUCHE : visuel ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Image principale */}
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 bg-gradient-to-br from-slate-50 via-green-50/50 to-emerald-100/70 aspect-square flex items-center justify-center shadow-sm">
              {produit.badge && (
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-black bg-green-600 text-white px-3 py-1.5 rounded-full shadow">
                    {produit.badge}
                  </span>
                </div>
              )}
              <span className="text-[100px] select-none drop-shadow-lg">{produit.image}</span>
            </div>

            {/* Carte vendeur */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                🏭
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-bold text-gray-900">{produit.vendeur}</p>
                  <VerifiedIcon sx={{ fontSize: 15, color: "#16a34a" }} />
                </div>
                <p className="text-xs text-gray-400">Partenaire certifié Waste Tracker</p>
              </div>
            </div>

            {/* Informations livraison */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
              <LocalShippingIcon sx={{ fontSize: 20, color: "#16a34a", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-bold text-green-800 mb-0.5">Livraison disponible</p>
                <p className="text-xs text-green-700">Frais : 1 500 FCFA · Délai : 24–48h après confirmation de commande</p>
              </div>
            </div>
          </div>

          {/* ── DROITE : infos + achat ──────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Catégorie */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit border border-green-100">
              {categorie?.emoji} {categorie?.label}
            </span>

            {/* Titre */}
            <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{produit.nom}</h1>

            {/* Note */}
            <Etoiles note={produit.note} nbAvis={produit.nbAvis} />

            {/* Prix */}
            <div className="flex items-baseline gap-2 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
              <span className="text-3xl font-black text-gray-900">{formatPrix(produit.prix)}</span>
              <span className="text-sm text-gray-400 font-medium">/ {produit.unite}</span>
            </div>

            {/* Stock */}
            <div>
              {epuise ? (
                <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                  <WarningAmberIcon sx={{ fontSize: 17 }} /> Rupture de stock
                </div>
              ) : produit.stockDisponible <= 20 ? (
                <div className="flex items-center gap-2 text-amber-700 text-sm font-bold bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
                  ⚡ Plus que {produit.stockDisponible} {produit.unite} disponibles
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-50 px-4 py-2.5 rounded-xl border border-green-100">
                  <CheckCircleIcon sx={{ fontSize: 17 }} /> En stock · {produit.stockDisponible} {produit.unite}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{produit.description}</p>

            {/* Détails techniques */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <InventoryIcon sx={{ fontSize: 12 }} /> Détails techniques
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">{produit.details}</p>
            </div>

            {/* Sélecteur quantité */}
            {!epuise && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700">Quantité</span>
                  <span className="text-sm font-black text-green-700 bg-green-50 px-3 py-1 rounded-xl">
                    Total : {formatPrix(sousTotal)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQte(q => Math.max(1, q-1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                      <RemoveIcon sx={{ fontSize: 18 }} />
                    </button>
                    <span className="w-12 text-center text-base font-black text-gray-900">{qte}</span>
                    <button onClick={() => setQte(q => Math.min(produit.stockDisponible, q+1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                      <AddIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">× {formatPrix(produit.prix)} / {produit.unite}</span>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <button onClick={handleCommander} disabled={epuise || loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-black text-sm hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 active:scale-[.98]">
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Traitement…</>
                  : epuise ? "Indisponible"
                  : <><ShoppingBagIcon sx={{ fontSize: 18 }} /> Commander maintenant · {formatPrix(sousTotal)}</>}
              </button>

              <button onClick={handleAjouterPanier} disabled={epuise}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 active:scale-[.98] ${
                  flashPanier
                    ? "border-green-400 bg-green-50 text-green-700"
                    : epuise
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-green-600 text-green-700 hover:bg-green-50"
                }`}>
                {flashPanier
                  ? <><CheckCircleIcon sx={{ fontSize: 18 }} /> Ajouté au panier !</>
                  : <><ShoppingCartIcon sx={{ fontSize: 18 }} /> Ajouter au panier</>}
              </button>
            </div>

            <p className="text-[11px] text-gray-300 text-center">
              Mis en vente le {new Date(produit.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
