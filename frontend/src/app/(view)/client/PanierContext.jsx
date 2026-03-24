"use client";

import { createContext, useContext, useState, useCallback } from "react";

const PanierContext = createContext(null);

export function PanierProvider({ children }) {
  const [items, setItems] = useState([]);

  const ajouter = useCallback((produit, qte = 1) => {
    setItems(prev => {
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
        categorie: produit.categorie,
        quantite: qte,
      }];
    });
  }, []);

  const modifier = useCallback((produitId, delta) => {
    setItems(prev =>
      prev
        .map(i => i.produitId === produitId ? { ...i, quantite: i.quantite + delta } : i)
        .filter(i => i.quantite > 0)
    );
  }, []);

  const supprimer = useCallback((produitId) => {
    setItems(prev => prev.filter(i => i.produitId !== produitId));
  }, []);

  const vider = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.prixUnit * i.quantite, 0);
  const nbItems = items.reduce((s, i) => s + i.quantite, 0);

  return (
    <PanierContext.Provider value={{ items, ajouter, modifier, supprimer, vider, total, nbItems }}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error("usePanier doit être utilisé dans un PanierProvider");
  return ctx;
}
