"use client";

import { useState } from "react";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import SaveIcon from "@mui/icons-material/Save";
import { User } from "lucide-react";
import Link from "next/link";

export default function AdminProfile() {

  const [isEditing, setIsEditing] = useState(false);

  const [admin, setAdmin] = useState({
    name: "Fongang",
    surname: "Bryan",
    email: "fongang.bryan@gmail.com",
    tel: "+237 699 453 207",
    site: "Waste Tracker",
    city: "Aucune",
    photo: "/assets/photo de profil.jpeg"
  });

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value
    });
  };

  const saveChanges = () => {
    console.log("Updated admin:", admin);
    setIsEditing(false);
  };

  return (

    <div className="w-full flex justify-center bg-green-50 p-10">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">

        {/* TITRE */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Mon Profil Admin
        </h1>

        {/* PHOTO */}
        <div className="flex flex-col items-center mb-10">

          <div className="relative">

            <div className="w-50 h-50 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

              {admin.photo ? (
                <Image
                  src={admin.photo}
                  alt="photo profil"
                  width={200}
                  height={200}
                />
              ) : (
                <User size={48}/>
              )}

            </div>

            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow">
                <EditIcon fontSize="small"/>
              </button>
            )}

          </div>

        </div>

        {/* INFOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-xl mx-auto">

          {/* USERNAME */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-500">
              Nom complet
            </label>

            {isEditing ? (
              <input
                type="text"
                name="fullname"
                value={`${admin.name} ${admin.surname}`}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                {admin.name} {admin.surname}  
              </p>
            )}
          </div>

          {/* TEL */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-500">
              Numéro de téléphone
            </label>

            {isEditing ? (
              <input
                type="text"
                name="tel"
                value={admin.tel}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                {admin.tel}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-500">
              Adresse mail
            </label>

            {isEditing ? (
              <input
                type="text"
                name="email"
                value={admin.email}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">
                {admin.email}
              </p>
            )}
          </div>

          {/* SITE */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-500">
              Site administré
            </label>

            <p className="text-gray-700">
              {admin.site}
            </p>

          </div>

          {/* CITY */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-500">
              Ville
            </label>

            <p className="text-gray-700">
              {admin.city}
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="flex justify-center gap-6 mt-12">

          {isEditing ? (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <SaveIcon/>
              Enregistrer
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <EditIcon/>
              Modifier profil
            </button>
          )}

          <Link
            href="/forgottenPassword"
            className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <LockResetIcon/>
            Modifier mot de passe
          </Link>

        </div>

      </div>

    </div>

  );
}