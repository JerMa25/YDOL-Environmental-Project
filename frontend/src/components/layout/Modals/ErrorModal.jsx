"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorModal({ message, onClose }) {
  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">

        <ErrorOutlineIcon className="text-red-600 mb-3" style={{fontSize:40}}/>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Une erreur est survenue
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Fermer
        </button>

      </div>

    </div>

  );
}