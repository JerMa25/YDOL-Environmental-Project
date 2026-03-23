// ─── ENDPOINTS (à brancher plus tard) ────────────────────────────────────────
// GET  /api/boutique/produits               → liste des produits
// GET  /api/boutique/produits/:id           → détail d'un produit
// GET  /api/boutique/categories             → liste des catégories
// POST /api/boutique/commandes              → passer une commande
//   Body: { citoyenId, items: [{ produitId, quantite }], adresseLivraison }
// GET  /api/boutique/commandes?citoyenId=:id → mes commandes (panier/historique)
// GET  /api/boutique/commandes/:id          → détail d'une commande

export const CATEGORIES = [
  { id: "tous",      label: "Tous",           emoji: "🛒" },
  { id: "plastique", label: "Plastique",      emoji: "♻️" },
  { id: "metal",     label: "Métal / Ferraille", emoji: "⚙️" },
  { id: "papier",    label: "Papier / Carton", emoji: "📦" },
  { id: "verre",     label: "Verre",          emoji: "🍶" },
  { id: "organique", label: "Compost / Organique", emoji: "🌱" },
  { id: "electronique", label: "Électronique", emoji: "💻" },
  { id: "textile",   label: "Textile",        emoji: "👕" },
  { id: "bois",      label: "Bois",           emoji: "🪵" },
];

export const PRODUITS_MOCK = [
  {
    id: "p1",
    nom: "Granulés plastique HDPE",
    categorie: "plastique",
    prix: 1200,
    unite: "kg",
    stockDisponible: 340,
    description: "Granulés de plastique HDPE recyclé, idéaux pour la fabrication d'objets moulés. Triés et nettoyés, conditionnés en sacs de 25 kg.",
    details: "Origine : collecte urbaine Yaoundé. Taux de pureté : 95%. Couleur : naturel/translucide. Conditionnement min : 25 kg.",
    image: "♻️",
    vendeur: "Centre Recyclage Yaoundé",
    note: 4.5,
    nbAvis: 23,
    created_at: "2024-02-10",
  },
  {
    id: "p2",
    nom: "Ferraille acier brut",
    categorie: "metal",
    prix: 350,
    unite: "kg",
    stockDisponible: 1200,
    description: "Acier de récupération trié, convenant à la fonderie et à la fabrication artisanale.",
    details: "Type : acier doux. Forme : morceaux variés 5–30 cm. Non traité chimiquement. Livraison en vrac ou en big-bag 500 kg.",
    image: "⚙️",
    vendeur: "Ferrailleur Douala Sud",
    note: 4.2,
    nbAvis: 41,
    created_at: "2024-01-15",
  },
  {
    id: "p3",
    nom: "Carton ondulé récupéré",
    categorie: "papier",
    prix: 180,
    unite: "kg",
    stockDisponible: 800,
    description: "Carton ondulé de récupération, compressé en balles. Parfait pour emballage, isolation ou revente papeterie.",
    details: "Format balles : 80×60×40 cm. Poids moyen balle : 30 kg. Humidité max 12%. Origine : grandes surfaces et entrepôts.",
    image: "📦",
    vendeur: "PaperCycle CM",
    note: 4.0,
    nbAvis: 17,
    created_at: "2024-03-01",
  },
  {
    id: "p4",
    nom: "Bouteilles verre brun (lot)",
    categorie: "verre",
    prix: 90,
    unite: "unité (lot 100)",
    stockDisponible: 52,
    description: "Lot de 100 bouteilles en verre brun 75 cl, rincées et triées. Pour brasseries, conserveries ou artisans.",
    details: "Contenance : 75 cl. Couleur : brun. Bouchon : non fourni. Nettoyage : rinçage eau froide. Minimum : 1 lot (100 unités).",
    image: "🍶",
    vendeur: "VerreCycle Yaoundé",
    note: 4.7,
    nbAvis: 9,
    created_at: "2024-02-28",
  },
  {
    id: "p5",
    nom: "Compost organique mûr",
    categorie: "organique",
    prix: 500,
    unite: "sac 20 kg",
    stockDisponible: 220,
    description: "Compost 100% naturel issu de déchets ménagers organiques. Enrichit vos sols et améliore la structure de la terre.",
    details: "Maturité : 3 mois de compostage. pH : 6.5–7.5. Matière organique : >40%. Idéal : potagers, arbres fruitiers, fleurs.",
    image: "🌱",
    vendeur: "BioSol Cameroun",
    note: 4.8,
    nbAvis: 56,
    created_at: "2024-01-20",
  },
  {
    id: "p6",
    nom: "Pièces électroniques triées",
    categorie: "electronique",
    prix: 2500,
    unite: "lot 10 kg",
    stockDisponible: 18,
    description: "Composants électroniques de récupération : cartes mères, processeurs, câbles cuivre. Pour réparateurs et recycleurs spécialisés.",
    details: "Composition variable. Matériaux nobles : cuivre, aluminium, or traces. Dépollution : carte lithium retirée. Vente à des professionnels uniquement.",
    image: "💻",
    vendeur: "E-Waste Yaoundé",
    note: 3.9,
    nbAvis: 12,
    created_at: "2024-03-10",
  },
  {
    id: "p7",
    nom: "Chutes de tissu coton",
    categorie: "textile",
    prix: 300,
    unite: "kg",
    stockDisponible: 95,
    description: "Chutes de tissu coton multicolores, récupérées chez des tailleurs. Idéales pour chiffons, artisanat, isolation.",
    details: "Composition : 100% coton. Taille morceaux : 10–80 cm. Couleurs : mélange. Nettoyées et séchées. Vente min : 5 kg.",
    image: "👕",
    vendeur: "TextileLoop CM",
    note: 4.3,
    nbAvis: 28,
    created_at: "2024-02-05",
  },
  {
    id: "p8",
    nom: "Planches bois récupéré",
    categorie: "bois",
    prix: 250,
    unite: "unité",
    stockDisponible: 64,
    description: "Planches de bois de récupération, démontées de palettes ou chantiers. Pour bricolage, mobilier ou combustion.",
    details: "Dimensions moyennes : 120×10×2 cm. Essence : mélange (pin, iroko). Clous retirés. Non traité chimiquement. Vendu à l'unité.",
    image: "🪵",
    vendeur: "BoisRecup Douala",
    note: 4.1,
    nbAvis: 19,
    created_at: "2024-03-05",
  },
];

export const COMMANDES_MOCK = [
  {
    id: "cmd1",
    date: "2024-03-20",
    statut: "livré",
    items: [
      { produitId: "p5", nom: "Compost organique mûr", quantite: 3, prixUnit: 500, unite: "sac 20 kg", image: "🌱" },
      { produitId: "p3", nom: "Carton ondulé récupéré", quantite: 10, prixUnit: 180, unite: "kg", image: "📦" },
    ],
    adresseLivraison: "Rue des Palmiers Nr 12, Bastos, Yaoundé",
    fraisLivraison: 1500,
    paiement: "Mobile Money",
    reference: "WT-2024-001",
  },
  {
    id: "cmd2",
    date: "2024-03-15",
    statut: "en cours",
    items: [
      { produitId: "p1", nom: "Granulés plastique HDPE", quantite: 25, prixUnit: 1200, unite: "kg", image: "♻️" },
    ],
    adresseLivraison: "Rue des Palmiers Nr 12, Bastos, Yaoundé",
    fraisLivraison: 2000,
    paiement: "Carte bancaire",
    reference: "WT-2024-002",
  },
  {
    id: "cmd3",
    date: "2024-02-28",
    statut: "livré",
    items: [
      { produitId: "p7", nom: "Chutes de tissu coton", quantite: 5, prixUnit: 300, unite: "kg", image: "👕" },
      { produitId: "p4", nom: "Bouteilles verre brun (lot)", quantite: 2, prixUnit: 90, unite: "lot 100", image: "🍶" },
    ],
    adresseLivraison: "Rue des Palmiers Nr 12, Bastos, Yaoundé",
    fraisLivraison: 1500,
    paiement: "Mobile Money",
    reference: "WT-2024-003",
  },
];

export const STATUT_COMMANDE = {
  "en attente": { label: "En attente",  bg: "bg-gray-100",   text: "text-gray-600",  dot: "bg-gray-400" },
  "en cours":   { label: "En cours",    bg: "bg-blue-50",    text: "text-blue-700",  dot: "bg-blue-500" },
  "expédié":    { label: "Expédié",     bg: "bg-amber-50",   text: "text-amber-700", dot: "bg-amber-500" },
  "livré":      { label: "Livré",       bg: "bg-green-50",   text: "text-green-700", dot: "bg-green-500" },
  "annulé":     { label: "Annulé",      bg: "bg-red-50",     text: "text-red-600",   dot: "bg-red-500" },
};

export function prixTotal(items, fraisLivraison = 0) {
  const sousTotal = items.reduce((s, i) => s + i.prixUnit * i.quantite, 0);
  return { sousTotal, fraisLivraison, total: sousTotal + fraisLivraison };
}

export function formatPrix(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}