"use client";

// ─── ENDPOINT (à brancher plus tard) ─────────────────────────────────────────
// POST /api/signalements
// Body (multipart/form-data) :
//   - binId       : string  — id du bac concerné (optionnel si inconnu)
//   - description : string  — description libre
//   - photo       : File    — photo du bac (optionnel)
//   - citoyenId   : string  — id du citoyen connecté (depuis le contexte auth)
//   - adresse     : string  — adresse saisie manuellement
//   - ville       : string

// GET /api/garbage-bins?city=:city → pour remplir la liste des bacs par ville

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";

// ─── MOCK : liste des bacs disponibles ───────────────────────────────────────

const bacsMock = [
  { id: 1, code: "BAC-YDE-001", adresse: "Rue des Palmiers Nr 12",        district: "Bastos",     city: "Yaoundé" },
  { id: 2, code: "BAC-YDE-002", adresse: "Av. de l'Indépendance Nr 45",   district: "Emana",      city: "Yaoundé" },
  { id: 3, code: "BAC-DLA-001", adresse: "Boulevard de la Liberté Nr 8",  district: "Akwa",       city: "Douala"  },
  { id: 4, code: "BAC-YDE-003", adresse: "Rue du Stade Nr 3",             district: "Nlongkak",   city: "Yaoundé" },
  { id: 5, code: "BAC-DLA-002", adresse: "Rue Prince Bell Nr 22",         district: "Bonapriso",  city: "Douala"  },
];

const VILLES = [...new Set(bacsMock.map((b) => b.city))];

// ─── ÉTAPES ───────────────────────────────────────────────────────────────────

const ETAPES = [
  { num: 1, label: "Localisation" },
  { num: 2, label: "Détails"      },
  { num: 3, label: "Confirmation" },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export default function SignalerBacPlein() {
  const router = useRouter();

  const [etape, setEtape]           = useState(1);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);

  // Étape 1 — localisation
  const [ville, setVille]           = useState("");
  const [bacId, setBacId]           = useState("");
  const [adresseManuelle, setAdresseManuelle] = useState("");

  // Étape 2 — détails
  const [description, setDescription] = useState("");
  const [photo, setPhoto]             = useState(null);      // File object
  const [photoPreview, setPhotoPreview] = useState(null);    // base64 URL
  const fileInputRef = useRef(null);

  // Erreurs
  const [errors, setErrors] = useState({});

  // ─── Bacs filtrés par ville ───────────────────────────────────────────────

  const bacsFiltres = ville
    ? bacsMock.filter((b) => b.city === ville)
    : bacsMock;

  const bacSelectionne = bacsMock.find((b) => b.id === parseInt(bacId));

  // ─── Gestion photo ────────────────────────────────────────────────────────

  const handlePhoto = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, photo: "La photo ne doit pas dépasser 5 Mo." }));
      return;
    }
    setPhoto(file);
    setErrors((e) => ({ ...e, photo: null }));
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handlePhoto(file);
  };

  const supprimerPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Validation par étape ─────────────────────────────────────────────────

  const validerEtape1 = () => {
    const errs = {};
    if (!ville) errs.ville = "Veuillez sélectionner une ville.";
    if (!bacId && !adresseManuelle.trim())
      errs.bac = "Sélectionnez un bac ou saisissez une adresse.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validerEtape2 = () => {
    const errs = {};
    if (!description.trim())
      errs.description = "Veuillez décrire le problème.";
    if (description.trim().length < 10)
      errs.description = "Description trop courte (min. 10 caractères).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Navigation entre étapes ──────────────────────────────────────────────

  const suivant = () => {
    if (etape === 1 && validerEtape1()) setEtape(2);
    if (etape === 2 && validerEtape2()) setEtape(3);
  };

  const precedent = () => {
    setErrors({});
    setEtape((e) => e - 1);
  };

  // ─── Soumission ───────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setLoading(true);

    // Construction du FormData pour l'upload de photo
    // const formData = new FormData();
    // formData.append("binId", bacId);
    // formData.append("description", description);
    // formData.append("adresse", bacSelectionne?.adresse || adresseManuelle);
    // formData.append("ville", ville);
    // formData.append("citoyenId", "c001"); // depuis contexte auth
    // if (photo) formData.append("photo", photo);
    //
    // await fetch("/api/signalements", { method: "POST", body: formData });

    // Simulation latence
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  // ─── ÉCRAN SUCCÈS ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Signalement envoyé !</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            Votre signalement a bien été transmis à la tour de contrôle.
            Un chauffeur sera dépêché dans les plus brefs délais.
          </p>
          {(bacSelectionne || adresseManuelle) && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-800 font-medium mb-6 mt-4">
              📍 {bacSelectionne ? `${bacSelectionne.code} — ${bacSelectionne.adresse}` : adresseManuelle}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
            >
              Retour au tableau de bord
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setEtape(1);
                setVille(""); setBacId(""); setAdresseManuelle("");
                setDescription(""); setPhoto(null); setPhotoPreview(null);
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
            >
              Faire un autre signalement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* BOUTON RETOUR */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-semibold mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Retour
      </button>

      <div className="max-w-xl mx-auto">

        {/* EN-TÊTE */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Signaler un bac plein</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Informez la tour de contrôle pour une collecte rapide
            </p>
          </div>
        </div>

        {/* STEPPER */}
        <div className="flex items-center mb-8">
          {ETAPES.map((e, i) => (
            <div key={e.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  etape > e.num
                    ? "bg-green-600 text-white"
                    : etape === e.num
                    ? "bg-green-600 text-white ring-4 ring-green-100"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {etape > e.num ? "✓" : e.num}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${
                  etape >= e.num ? "text-green-700" : "text-gray-400"
                }`}>{e.label}</span>
              </div>
              {i < ETAPES.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${
                  etape > e.num ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* CARTE FORMULAIRE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">

          {/* ── ÉTAPE 1 : Localisation ────────────────────────────────────── */}
          {etape === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800">
                Où se trouve le bac ?
              </h2>

              {/* Ville */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Ville <span className="text-red-500">*</span>
                </label>
                <select
                  value={ville}
                  onChange={(e) => { setVille(e.target.value); setBacId(""); }}
                  className={`w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition ${
                    errors.ville ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Sélectionner une ville…</option>
                  {VILLES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {errors.ville && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.ville}
                  </p>
                )}
              </div>

              {/* Sélection du bac */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Bac concerné
                </label>
                <select
                  value={bacId}
                  onChange={(e) => { setBacId(e.target.value); setAdresseManuelle(""); }}
                  disabled={!ville}
                  className={`w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.bac ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Choisir un bac dans la liste…</option>
                  {bacsFiltres.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.adresse} ({b.district})
                    </option>
                  ))}
                </select>

                {/* Aperçu bac sélectionné */}
                {bacSelectionne && (
                  <div className="mt-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
                    <Trash2 size={16} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-green-800">{bacSelectionne.code}</p>
                      <p className="text-xs text-green-600">{bacSelectionne.adresse}, {bacSelectionne.district}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Séparateur OU */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">ou</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Adresse manuelle */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Saisir l'adresse manuellement
                </label>
                <input
                  type="text"
                  value={adresseManuelle}
                  onChange={(e) => { setAdresseManuelle(e.target.value); setBacId(""); }}
                  placeholder="Ex : Rue des Palmiers Nr 12, Bastos"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition ${
                    errors.bac ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.bac && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.bac}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : Détails ─────────────────────────────────────────── */}
          {etape === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800">
                Décrivez le problème
              </h2>

              {/* Rappel localisation */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <Trash2 size={15} className="text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600 font-medium">
                  {bacSelectionne
                    ? `${bacSelectionne.code} — ${bacSelectionne.adresse}`
                    : adresseManuelle}
                  {ville && `, ${ville}`}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex : Le bac déborde depuis 2 jours, les ordures sont répandues sur le trottoir…"
                  rows={4}
                  maxLength={500}
                  className={`w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition ${
                    errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={11} /> {errors.description}
                    </p>
                  ) : <span />}
                  <span className="text-xs text-gray-400 ml-auto">
                    {description.length}/500
                  </span>
                </div>
              </div>

              {/* Upload photo */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Photo du bac <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>

                {photoPreview ? (
                  /* Aperçu photo */
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={photoPreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={supprimerPhoto}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition"
                      title="Supprimer la photo"
                    >
                      <X size={15} className="text-gray-600" />
                    </button>
                    <div className="px-3 py-2 bg-white border-t border-gray-100">
                      <p className="text-xs text-gray-500 truncate">
                        📎 {photo?.name} · {(photo?.size / 1024).toFixed(0)} Ko
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Zone de drop */
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-green-400 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-green-50 rounded-full flex items-center justify-center transition-colors">
                      <Upload size={20} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-green-700 transition-colors">
                        Cliquez ou glissez une photo ici
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — max 5 Mo</p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhoto(e.target.files[0])}
                />

                {errors.photo && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> {errors.photo}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : Récapitulatif ───────────────────────────────────── */}
          {etape === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-800">
                Récapitulatif du signalement
              </h2>

              {/* Bloc localisation */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
                <RecapRow label="Bac / Adresse" value={
                  bacSelectionne
                    ? `${bacSelectionne.code} — ${bacSelectionne.adresse}, ${bacSelectionne.district}`
                    : adresseManuelle
                } />
                <RecapRow label="Ville" value={ville} />
                <RecapRow label="Description" value={description} multiline />
              </div>

              {/* Aperçu photo si présente */}
              {photoPreview && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Photo jointe</p>
                  <img
                    src={photoPreview}
                    alt="Photo du bac"
                    className="w-full h-40 object-cover rounded-xl border border-gray-100"
                  />
                </div>
              )}

              {/* Avertissement */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  En soumettant ce signalement, vous confirmez que les informations fournies sont exactes.
                  La tour de contrôle en sera immédiatement notifiée.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BOUTONS DE NAVIGATION */}
        <div className="flex gap-3">
          {etape > 1 && (
            <button
              onClick={precedent}
              disabled={loading}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
            >
              ← Précédent
            </button>
          )}

          {etape < 3 ? (
            <button
              onClick={suivant}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition active:scale-[.98]"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition active:scale-[.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity=".3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Envoi en cours…
                </>
              ) : (
                <>
                  <AlertTriangle size={16} />
                  Envoyer le signalement
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SOUS-COMPOSANT : ligne de récapitulatif ──────────────────────────────────

function RecapRow({ label, value, multiline = false }) {
  return (
    <div className={`px-4 py-3 ${multiline ? "flex flex-col gap-1" : "flex items-start justify-between gap-4"}`}>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">
        {label}
      </span>
      <span className={`text-sm font-medium text-gray-800 ${multiline ? "" : "text-right"}`}>
        {value || <span className="text-gray-300 italic">Non renseigné</span>}
      </span>
    </div>
  );
}