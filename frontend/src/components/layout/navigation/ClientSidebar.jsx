"use client";

import Sidebar from "../Sidebar";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import MapIcon from '@mui/icons-material/Map';
import { Bell } from "lucide-react"; 
import { RecycleIcon } from "lucide-react";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import StarRateIcon from '@mui/icons-material/StarRate';

export default function ClientSidebar() {
  const menuItems = [
    {
      href: "/client/dashboard",
      label: "Dashboard",
      icon: <DashboardIcon/>
    },
    {
      label: "Bacs à ordures",
      icon: <RecycleIcon/>,
      isDropdown: true,
      subItems: [
        { href: "/client/garbageBinList", label: "Liste des bacs à ordures" },
        { href: "/client/BinReport", label: "Signaler un bac à ordures" },
      ]
    },
    {
      href: "/client/notificationsCenter",
      label: "Notifications",
      icon: <Bell/>
    },
    {
      label: "Produits",
      icon: <ProductionQuantityLimitsIcon/>,
      isDropdown: true,
      subItems: [
        { href: "/client/produit", label: "Grille des produits" },
        { href: "/client/panier", label: "Panier" },
      ]
    },
    {
      href: "/client/vip",
      label: "Collecte VIP",
      icon: <StarRateIcon/>
    },
    {
      href: "/admin/map",
      label: "Carte",
      icon: <MapIcon/>
    },
  ];

  return (
    <Sidebar
      menuItems={menuItems}
      userName="Utilisateur"
    />
  );
}