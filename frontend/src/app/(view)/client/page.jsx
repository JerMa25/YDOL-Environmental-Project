"use client";

// ─── ENDPOINTS ────────────────────────────────────────────────────────────────
// GET /api/boutique/produits            → liste produits
// GET /api/boutique/produits/:id        → détail produit
// POST /api/boutique/commandes          → passer commande

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Search, ArrowLeft, Plus, Minus,
  CheckCircle, Package, MapPin, Star, AlertTriangle,
  ChevronRight, X, Leaf
} from "lucide-react";
import { CATEGORIES, produitsMock } from "./mockBoutique";

// ─── CARTE PRODUIT ────────────────────────────────────────────────────────────

function CarteP({ produit, onClick, onAjouter }) {
  const [added, setAdded] = useState(false);

  const handleAjouter = (e) => {
    e.stopPropagation();
    onAjouter(produit, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const stockBas = produit.stock < 50;

  return (
    <div
      onClick={() => onClick(produit)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-green-200 transition-all cursor-pointer group flex flex-col"
    >
      {/* Visuel */}
      <div className={`${produit.couleur} h-36 flex items-center justify-center relative`}>
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {produit.emoji}
        </span>
        {produit.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
            produit.badge === "Bio"          ? "bg-green-600 text-white" :
            produit.badge === "Populaire"    ? "bg-blue-600 text-white" :
            produit.badge === "Stock limité" ? "bg-red-500 text-white" :
            "bg-gray-800 text-white"
          }`}>
            {produit.badge}
          </span>
        )}
        {stockBas && !produit.badge && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white">
            Stock bas
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 font-semibold mb-1">
          {CATEGORIES.find(c => c.id === produit.categorie)?.label}
        </p>
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
          {produit.nom}
        </h3>
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <MapPin size={10} /> {produit.ville}
        </p>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-black text-green-700">
              {produit.prix.toLocaleString("fr-FR")} FCFA
            </span>
            <span className="text-xs text-gray-400 ml-1">/ {produit.unite}</span>
          </div>
          <button
            onClick={handleAjouter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
            }`}
          >
            {added ? <><CheckCircle size={13} /> Ajouté</> : <><ShoppingCart size={13} /> Ajouter</>}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Stock : <strong className={stockBas ? "text-amber-600" : "text-gray-600"}>
            {produit.stock} {produit.unite}
          </strong>
          {" · "}Min. {produit.minCommande} {produit.unite}
        </p>
      </div>
    </div>
  );
}

// ─── MODAL DÉTAIL PRODUIT ─────────────────────────────────────────────────────

function ModalDetail({ produit, onClose, onAjouter, panier }) {
  const [qte, setQte] = useState(produit.minCommande);
  const [added, setAdded] = useState(false);
  const dejaAuPanier = panier.find(i => i.id === produit.id);

  const handleAjouter = () => {
    onAjouter(produit, qte);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className={`${produit.couleur} px-6 pt-6 pb-4 relative`}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition shadow-sm">
            <X size={16} className="text-gray-600" />
          </button>
          <div className="text-6xl mb-3">{produit.emoji}</div>
          {produit.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              produit.badge === "Bio"       ? "bg-green-600 text-white" :
              produit.badge === "Populaire" ? "bg-blue-600 text-white" :
              "bg-red-500 text-white"
            }`}>{produit.badge}</span>
          )}
        </div>

        <div className="px-6 py-5">
          <p className="text-xs text-gray-400 font-semibold mb-1">
            {CATEGORIES.find(c => c.id === produit.categorie)?.label}
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-1">{produit.nom}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
            <MapPin size={12} /> {produit.vendeur}, {produit.ville}
          </p>

          {/* Prix */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black text-green-700">
              {produit.prix.toLocaleString("fr-FR")} FCFA
            </span>
            <span className="text-sm text-gray-400">/ {produit.unite}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{produit.description}</p>

          {/* Qualité */}
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-bold text-green-800 mb-0.5 flex items-center gap-1">
              <Leaf size={12} /> Qualité
            </p>
            <p className="text-sm text-green-700">{produit.qualite}</p>
          </div>

          {/* Usages */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Usages recommandés</p>
            <div className="flex flex-wrap gap-2">
              {produit.usage.map((u, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-between text-sm mb-5 bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-gray-500">Stock disponible</span>
            <span className="font-bold text-gray-800">{produit.stock} {produit.unite}</span>
            <span className="text-gray-400 text-xs">Min. {produit.minCommande} {produit.unite}</span>
          </div>

          {/* Quantité */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Quantité</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQte(Math.max(produit.minCommande, qte - produit.minCommande))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                <Minus size={16} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-xl font-black text-gray-900">{qte}</span>
                <span className="text-sm text-gray-400 ml-1">{produit.unite}</span>
              </div>
              <button
                onClick={() => setQte(Math.min(produit.stock, qte + produit.minCommande))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400">Total : </span>
              <span className="text-sm font-black text-green-700">
                {(qte * produit.prix).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>

          {/* Bouton */}
          {dejaAuPanier && (
            <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3 flex items-center justify-center gap-1">
              <AlertTriangle size={12} />
              Déjà dans votre panier ({dejaAuPanier.quantite} {produit.unite})
            </p>
          )}
          <button
            onClick={handleAjouter}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-[.98]"
            }`}
          >
            {added
              ? <><CheckCircle size={16} /> Ajouté au panier !</>
              : <><ShoppingCart size={16} /> Ajouter au panier — {(qte * produit.prix).toLocaleString("fr-FR")} FCFA</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE BOUTIQUE ────────────────────────────────────────────────────────────

export default function Boutique() {
  const router = useRouter();
  const [categorie, setCategorie] = useState("tous");
  const [search, setSearch]       = useState("");
  const [produitSelec, setProduitSelec] = useState(null);
  const [panier, setPanier]       = useState([]);
  const [flashPanier, setFlashPanier] = useState(false);

  const produitsFiltres = produitsMock.filter((p) => {
    const matchCat    = categorie === "tous" || p.categorie === categorie;
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) ||
                        p.categorie.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPanier = panier.reduce((s, i) => s + i.quantite, 0);

  const ajouterAuPanier = (produit, qte) => {
    setPanier((prev) => {
      const exist = prev.find(i => i.id === produit.id);
      if (exist) {
        return prev.map(i => i.id === produit.id
          ? { ...i, quantite: i.quantite + qte }
          : i
        );
      }
      return [...prev, { ...produit, quantite: qte }];
    });
    setFlashPanier(true);
    setTimeout(() => setFlashPanier(false), 600);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MODAL DÉTAIL */}
      {produitSelec && (
        <ModalDetail
          produit={produitSelec}
          onClose={() => setProduitSelec(null)}
          onAjouter={ajouterAuPanier}
          panier={panier}
        />
      )}

      {/* TOPBAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-green-700 transition group flex items-center gap-1.5 text-sm font-semibold">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              Boutique déchets valorisés
            </h1>
            <p className="text-xs text-gray-400">{produitsFiltres.length} produit{produitsFiltres.length > 1 ? "s" : ""} disponible{produitsFiltres.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Recherche */}
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un produit…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 w-52"
            />
          </div>

          {/* Panier */}
          <Link href="/boutique/panier"
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              flashPanier
                ? "bg-green-600 text-white scale-105"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <ShoppingCart size={16} />
            Panier
            {totalPanier > 0 && (
              <span className="w-5 h-5 bg-green-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                {totalPanier}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* FILTRES CATÉGORIES */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategorie(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                categorie === cat.id
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {categorie === cat.id && cat.id !== "tous" && (
                <span className="bg-white/20 text-white text-xs px-1.5 rounded-full">
                  {produitsMock.filter(p => p.categorie === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* GRILLE PRODUITS */}
        {produitsFiltres.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 text-gray-400">
            <Package size={48} className="text-gray-200" />
            <p className="text-base font-bold">Aucun produit dans cette catégorie</p>
            <button onClick={() => { setCategorie("tous"); setSearch(""); }}
              className="text-sm text-green-600 font-bold hover:underline">
              Voir tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {produitsFiltres.map((p) => (
              <CarteP
                key={p.id}
                produit={p}
                onClick={setProduitSelec}
                onAjouter={ajouterAuPanier}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
