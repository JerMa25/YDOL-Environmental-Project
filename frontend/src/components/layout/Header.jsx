"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Logout } from "@mui/icons-material";

export default function Header({ user }) {
  const router = useRouter();
  const pathname = usePathname();

  const pageTitles = {
    "/admin/dashboard": "TABLEAU DE BORD",
    "/admin/map": "CARTE",
    "/admin/driverList": "LISTE DES CHAUFFEURS",
    "/admin/addDriver": "AJOUTER UN CHAUFFEUR",
    "/admin/missionList": "MISSIONS",
    "/admin/garbageBinList": "LISTE DES BACS",
    "/admin/addGarbageBin": "AJOUTER UN BAC",
    "/admin/userList": "CLIENTS",
    "/admin/adminList": "LISTE DES ADMINISTRATEURS",
    "/admin/addAdmin": "AJOUTER UN ADMINISTRATEUR",
    "/admin/profile": "PROFIL ADMINISTRATEUR",
    "/admin/notifications": "NOTIFICATIONS",
    "/forgottenPassword": "RÉINITIALISATION DU MOT DE PASSE",
  };

  const title = pageTitles[pathname] || "WASTE TRACKER";

  return (
    <header className="flex justify-between items-center h-16 px-6 border-b bg-white">

      <h1 className="text-xl font-bold text-green-600">
        {title}
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">
          {user?.name} {user?.surname}
        </span>

        <Link className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center" href="/admin/profile">
          {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
        </Link>

        <div>
          <Logout className="text-gray-600 cursor-pointer" onClick={() => {router.push('/')}}/>
        </div>

      </div>
    </header>
  );
}