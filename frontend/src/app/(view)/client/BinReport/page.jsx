"use client";

/*
────────────────────────────────────────────
ENDPOINTS
────────────────────────────────────────────
GET  /api/garbage-bins?city=:city
POST /api/signalements (multipart/form-data)
*/

import { useState, useRef } from "react";
import {
  Box, Button, TextField, Typography, Card,
  MenuItem, Stepper, Step, StepLabel,
  Avatar, Chip
} from "@mui/material";

import {
  WarningAmber, CloudUpload, CheckCircle,
  LocationOn, Delete
} from "@mui/icons-material";

// MOCK DATA
const bacsMock = [
  { id: 1, code: "BAC-YDE-001", adresse: "Bastos", city: "Yaoundé" },
  { id: 2, code: "BAC-YDE-002", adresse: "Emana", city: "Yaoundé" }
];

const steps = ["Localisation", "Détails", "Validation"];

export default function SignalerBacPlein() {

  const [step, setStep] = useState(0);

  const [ville, setVille] = useState("");
  const [bacId, setBacId] = useState("");
  const [adresse, setAdresse] = useState("");

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const bacs = ville
    ? bacsMock.filter(b => b.city === ville)
    : [];

  const handleFile = (file) => {
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("binId", bacId);
    formData.append("description", description);
    formData.append("adresse", adresse);
    formData.append("ville", ville);
    formData.append("citoyenId", "c001");
    if (photo) formData.append("photo", photo);

    // await fetch("/api/signalements", { method: "POST", body: formData });

    setSuccess(true);
  };

  if (success) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Card sx={{
          p: 5,
          borderRadius: 6,
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}>
          <CheckCircle sx={{ fontSize: 60, color: "#16a34a" }} />
          <Typography mt={2} fontWeight="bold">
            Signalement envoyé avec succès
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3
      }}
    >
      <Box maxWidth={600} mx="auto">

        {/* HEADER PREMIUM */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 6,
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
              <WarningAmber />
            </Avatar>
            <Box>
              <Typography fontWeight="bold">
                Signaler un bac plein
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Aidez la ville à rester propre 🌱
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* STEPPER */}
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {steps.map((s) => (
            <Step key={s}><StepLabel>{s}</StepLabel></Step>
          ))}
        </Stepper>

        {/* CARD */}
        <Card sx={{
          p: 4,
          borderRadius: 6,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>

          {/* STEP 1 */}
          {step === 0 && (
            <Box display="flex" flexDirection="column" gap={3}>

              <TextField
                select
                label="Ville"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="Yaoundé">Yaoundé</MenuItem>
                <MenuItem value="Douala">Douala</MenuItem>
              </TextField>

              {/* BAC */}
              <Box>
                <Typography fontWeight="bold" mb={1}>
                  Bac concerné
                </Typography>

                <TextField
                  select
                  fullWidth
                  value={bacId}
                  onChange={(e) => {
                    setBacId(e.target.value);
                    setAdresse("");
                  }}
                >
                  {bacs.map(b => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.code} - {b.adresse}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* OR */}
              <Box textAlign="center">
                <Typography color="gray">OU</Typography>
              </Box>

              {/* ADRESSE */}
              <Box>
                <Typography fontWeight="bold" mb={1}>
                  Saisir l'adresse manuellement
                </Typography>

                <TextField
                  fullWidth
                  value={adresse}
                  onChange={(e) => {
                    setAdresse(e.target.value);
                    setBacId("");
                  }}
                  placeholder="Rue, quartier..."
                />
              </Box>

            </Box>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <Box display="flex" flexDirection="column" gap={3}>

              <TextField
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* UPLOAD */}
              {!preview ? (
                <Box
                  onClick={() => fileRef.current.click()}
                  sx={{
                    border: "2px dashed #16a34a",
                    borderRadius: 4,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      background: "#ecfdf5"
                    }
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40, color: "#16a34a" }} />
                  <Typography mt={1}>Ajouter une photo</Typography>
                </Box>
              ) : (
                <Box position="relative">
                  <img
                    src={preview}
                    style={{ width: "100%", borderRadius: 16 }}
                  />
                  <Button
                    onClick={() => {
                      setPreview(null);
                      setPhoto(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      minWidth: 0,
                      bgcolor: "white"
                    }}
                  >
                    <Delete />
                  </Button>
                </Box>
              )}

              <input
                hidden
                ref={fileRef}
                type="file"
                onChange={(e) => handleFile(e.target.files[0])}
              />

            </Box>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <Box display="flex" flexDirection="column" gap={2}>

              <Chip label={`Ville: ${ville}`} />
              <Chip label={`Adresse: ${adresse || "via bac"}`} />
              <Chip label={`Description: ${description}`} />

            </Box>
          )}

        </Card>

        {/* ACTIONS */}
        <Box display="flex" gap={2} mt={3}>

          {step > 0 && (
            <Button
              fullWidth
              onClick={() => setStep(step - 1)}
              sx={{
                borderRadius: 10
              }}
            >
              Précédent
            </Button>
          )}

          {step < 2 ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => setStep(step + 1)}
              sx={{
                borderRadius: 10,
                bgcolor: "#16a34a"
              }}
            >
              Suivant
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                borderRadius: 10,
                bgcolor: "#dc2626"
              }}
            >
              Envoyer
            </Button>
          )}

        </Box>

      </Box>
    </Box>
  );
}