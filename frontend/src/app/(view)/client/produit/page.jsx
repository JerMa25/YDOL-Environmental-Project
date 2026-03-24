"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Star, Package } from "lucide-react";
import { CATEGORIES, PRODUITS_MOCK, formatPrix } from "@/src/services/data";

// ─── CARTE PRODUIT ────────────────────────────────────────────────────────────

function CarteStock({ stock }) {
  if (stock === 0) return (
    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Rupture</span>
  );
  if (stock <= 20) return (
    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Plus que {stock}</span>
  );
  return (
    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">En stock</span>
  );
}

function EtoileNote({ note, nbAvis }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="text-amber-400 fill-amber-400" />
      <span className="text-xs font-bold text-gray-700">{note}</span>
      <span className="text-xs text-gray-400">({nbAvis})</span>
    </div>
  );
}

function CarteProduit({ produit, onAjouterPanier }) {
  const [qte, setQte] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const epuise = produit.stockDisponible === 0;

  const handleAjouter = (e) => {
    e.preventDefault();
    onAjouterPanier(produit, qte);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1800);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col">

      {/* Image / Emoji */}
      <Link href={`/client/produit/${produit.id}`} className="block">
        <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
          {produit.image}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Catégorie + stock */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full capitalize">
            {CATEGORIES.find(c => c.id === produit.categorie)?.emoji} {CATEGORIES.find(c => c.id === produit.categorie)?.label}
          </span>
          <CarteStock stock={produit.stockDisponible} />
        </div>

        {/* Nom */}
        <Link href={`client/produit/${produit.id}`}>
          <h3 className="text-sm font-bold text-gray-900 hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {produit.nom}
          </h3>
        </Link>

        {/* Note */}
        <EtoileNote note={produit.note} nbAvis={produit.nbAvis} />

        {/* Description courte */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed flex-1">
          {produit.description}
        </p>

        {/* Vendeur */}
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Package size={10} /> {produit.vendeur}
        </p>

        {/* Prix + actions */}
        <div className="border-t border-gray-50 pt-3 mt-1 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-black text-gray-900">
              {formatPrix(produit.prix)}
            </span>
            <span className="text-xs text-gray-400">/ {produit.unite}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantité */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQte(q => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-sm font-bold"
              >−</button>
              <span className="w-8 text-center text-sm font-bold text-gray-800">{qte}</span>
              <button
                onClick={() => setQte(q => Math.min(produit.stockDisponible, q + 1))}
                disabled={epuise}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition text-sm font-bold disabled:opacity-30"
              >+</button>
            </div>

            {/* Ajouter au panier */}
            <button
              onClick={handleAjouter}
              disabled={epuise}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                ajoute
                  ? "bg-green-100 text-green-700"
                  : epuise
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {ajoute ? "✓ Ajouté !" : epuise ? "Indisponible" : <><ShoppingCart size={12} /> Ajouter</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE produit ────────────────────────────────────────────────────────────

export default function produitPage() {
  const [categorieActive, setCategorieActive] = useState("tous");
  const [panier, setPanier] = useState([]);

  const produitsFiltres = categorieActive === "tous"
    ? PRODUITS_MOCK
    : PRODUITS_MOCK.filter(p => p.categorie === categorieActive);

  const nbPanier = panier.reduce((s, i) => s + i.quantite, 0);

  const ajouterPanier = (produit, qte) => {
    setPanier(prev => {
      const existant = prev.find(i => i.produitId === produit.id);
      if (existant) {
        return prev.map(i =>
          i.produitId === produit.id
            ? { ...i, quantite: i.quantite + qte }
            : i
        );
      }
      return [...prev, {
        produitId: produit.id,
        nom: produit.nom,
        prixUnit: produit.prix,
        unite: produit.unite,
        image: produit.image,
        quantite: qte,
      }];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER produit */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
              ♻️ produit déchets recyclables
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {produitsFiltres.length} produit{produitsFiltres.length > 1 ? "s" : ""} disponible{produitsFiltres.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Panier */}
          <Link
            href="/produit/panier"
            className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition shadow-sm"
          >
            <ShoppingCart size={16} />
            Mon panier
            {nbPanier > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white">
                {nbPanier}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* FILTRES CATÉGORIES */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                categorieActive === cat.id
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {cat.id !== "tous" && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ml-0.5 ${
                  categorieActive === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {PRODUITS_MOCK.filter(p => p.categorie === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* GRILLE PRODUITS */}
        {produitsFiltres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-base font-bold text-gray-600">Aucun produit dans cette catégorie</p>
            <p className="text-sm text-gray-400 mt-1">Revenez bientôt, le stock est mis à jour régulièrement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {produitsFiltres.map(produit => (
              <CarteProduit
                key={produit.id}
                produit={produit}
                onAjouterPanier={ajouterPanier}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}