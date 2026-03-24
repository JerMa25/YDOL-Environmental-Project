"use client";

// ENDPOINT: GET /api/produits?categorie=:cat&page=:p

import { useState } from "react";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StarIcon from "@mui/icons-material/Star";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CATEGORIES, PRODUITS_MOCK, formatPrix } from "@/src/services/data";
import { usePanier } from "@/src/context/PanierContext";

// ─── BADGE STOCK ──────────────────────────────────────────────────────────────
function BadgeStock({ stock }) {
  if (stock === 0)
    return <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Rupture</span>;
  if (stock <= 20)
    return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">⚡ {stock} restants</span>;
  return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">✓ En stock</span>;
}

// ─── ÉTOILES ──────────────────────────────────────────────────────────────────
function Etoiles({ note, petit = true }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <StarIcon key={n} sx={{ fontSize: petit ? 12 : 16,
          color: n <= Math.round(note) ? "#f59e0b" : "#e5e7eb" }} />
      ))}
      <span className={`font-bold text-gray-600 ml-1 ${petit ? "text-[11px]" : "text-sm"}`}>{note}</span>
    </div>
  );
}

// ─── CARTE PRODUIT ────────────────────────────────────────────────────────────
function CarteProduit({ produit }) {
  const { ajouter } = usePanier();
  const [qte, setQte] = useState(1);
  const [flash, setFlash] = useState(false);
  const epuise = produit.stockDisponible === 0;

  const handleAjouter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    ajouter(produit, qte);
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/8 transition-all duration-300 flex flex-col">

      {/* Badge */}
      {produit.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-black bg-green-600 text-white px-2.5 py-1 rounded-full shadow-sm">
            {produit.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/client/produit/${produit.id}`} className="block relative overflow-hidden">
        <div className="h-44 bg-gradient-to-br from-slate-50 via-green-50/40 to-emerald-100/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <span className="text-6xl drop-shadow-sm select-none">{produit.image}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Contenu */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">

        {/* Catégorie + stock */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            {CATEGORIES.find(c => c.id === produit.categorie)?.emoji}{" "}
            {CATEGORIES.find(c => c.id === produit.categorie)?.label}
          </span>
          <BadgeStock stock={produit.stockDisponible} />
        </div>

        {/* Nom */}
        <Link href={`/client/produit/${produit.id}`}>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {produit.nom}
          </h3>
        </Link>

        {/* Note + vendeur */}
        <div className="flex items-center justify-between">
          <Etoiles note={produit.note} />
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
            <InventoryIcon sx={{ fontSize: 11 }} /> {produit.vendeur.split(" ")[0]}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {produit.description}
        </p>

        {/* Prix + actions */}
        <div className="pt-2 border-t border-gray-50 mt-auto">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <span className="text-lg font-black text-gray-900">{formatPrix(produit.prix)}</span>
              <span className="text-[11px] text-gray-400 ml-1">/ {produit.unite}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sélecteur quantité */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={(e) => { e.preventDefault(); setQte(q => Math.max(1, q-1)); }}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                <RemoveIcon sx={{ fontSize: 14 }} />
              </button>
              <span className="w-7 text-center text-xs font-black text-gray-800">{qte}</span>
              <button onClick={(e) => { e.preventDefault(); setQte(q => Math.min(produit.stockDisponible, q+1)); }}
                disabled={epuise}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30">
                <AddIcon sx={{ fontSize: 14 }} />
              </button>
            </div>

            {/* Ajouter */}
            <button onClick={handleAjouter} disabled={epuise}
              className={`flex-1 h-8 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                flash
                  ? "bg-emerald-100 text-emerald-700 scale-95"
                  : epuise
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm"
              }`}>
              {flash
                ? <><CheckCircleIcon sx={{ fontSize: 13 }} /> Ajouté !</>
                : epuise
                ? "Indisponible"
                : <><ShoppingCartIcon sx={{ fontSize: 13 }} /> Ajouter</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PRODUITS ────────────────────────────────────────────────────────────
export default function ProduitPage() {
  const [catActive, setCatActive] = useState("tous");
  const { nbItems } = usePanier();

  const produits = catActive === "tous"
    ? PRODUITS_MOCK
    : PRODUITS_MOCK.filter(p => p.categorie === catActive);

  return (
    <div className="min-h-screen bg-[#f7f9f8]">

      {/* ── HERO HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <StorefrontIcon sx={{ fontSize: 20, color: "#fff" }} />
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900 tracking-tight">Marché des recyclables</h1>
              <p className="text-[11px] text-gray-400">
                {produits.length} produit{produits.length > 1 ? "s" : ""} · Yaoundé & Douala
              </p>
            </div>
          </div>

          <Link href="/client/produit/panier"
            className="relative flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition shadow-sm shadow-green-500/20">
            <ShoppingCartIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Mon panier</span>
            {nbItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {nbItems > 9 ? "9+" : nbItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 py-10 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">♻️ Économie circulaire</p>
          <h2 className="text-2xl font-black text-white mb-1 leading-tight">
            Donnez une seconde vie<br />aux déchets recyclables
          </h2>
          <p className="text-green-100 text-sm max-w-md">
            Achetez directement auprès de nos centres de collecte. Matières premières triées, certifiées et prêtes à l'emploi.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── FILTRES ────────────────────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => {
            const count = cat.id === "tous" ? PRODUITS_MOCK.length : PRODUITS_MOCK.filter(p => p.categorie === cat.id).length;
            const isActive = catActive === cat.id;
            return (
              <button key={cat.id} onClick={() => setCatActive(cat.id)}
                className={`flex items-center gap-1.5 pl-3 pr-3 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-500/20"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700 hover:bg-green-50"
                }`}>
                <span className="text-sm leading-none">{cat.emoji}</span>
                {cat.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── GRILLE ─────────────────────────────────────────────────────────── */}
        {produits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-dashed border-gray-200">
            <span className="text-6xl mb-4 opacity-40">🔍</span>
            <p className="text-base font-bold text-gray-500">Aucun produit dans cette catégorie</p>
            <p className="text-sm text-gray-400 mt-1">Revenez bientôt, le stock est mis à jour régulièrement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {produits.map(p => <CarteProduit key={p.id} produit={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
