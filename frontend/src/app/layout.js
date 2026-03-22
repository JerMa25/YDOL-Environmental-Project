import "./global.css";

export const metadata = {
  title: "Waste Tracker",
  description: "Application de gestion de collecte des déchets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}