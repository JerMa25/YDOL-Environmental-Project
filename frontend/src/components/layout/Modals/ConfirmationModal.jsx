"use client";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function ConfirmationModal({
  message,
  onConfirm,
  onCancel
}) {
  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">

        <HelpOutlineIcon className="text-yellow-500 mb-3" style={{fontSize:40}}/>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Confirmation
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirmer
          </button>

        </div>

      </div>

    </div>

  );
}