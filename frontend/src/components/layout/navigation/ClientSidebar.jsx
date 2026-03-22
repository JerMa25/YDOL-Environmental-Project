"use client";

import Sidebar from "../Sidebar";

export default function ClientSidebar() {
  const menuItems = [
    {
      href: "/client/dashboard",
      label: "Dashboard",
      icon: "📊"
    },
    {
      href: "/client/notifications",
      label: "Notifications",
      icon: "🔔"
    },
    {
      href: "/client/report",
      label: "Signaler un bac plein",
      icon: "♻️"
    },
    {
      href: "/client/vip",
      label: "Collecte VIP",
      icon: "⭐"
    },
    {
      href: "/client/history",
      label: "Historique",
      icon: "📜"
    },
    {
      href: "/client/profile",
      label: "Mon Profil",
      icon: "👤"
    }
  ];

  return (
    <Sidebar
      menuItems={menuItems}
      userName="Utilisateur"
    />
  );
}