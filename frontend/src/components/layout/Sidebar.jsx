"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Sidebar({ menuItems = [], userName = "Utilisateur" }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href) => pathname === href;
  
  const checkSubActive = (subItems) => {
    return subItems?.some(item => pathname === item.href);
  }

  const toggleDropdown = (index) => {
    setOpenDropdown((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // On ferme s'il était ouvert
        : [...prev, index]               // On ajoute s'il était fermé
    );
  };

  const SidebarContent = () => (
    <>
      {/* LOGO */}
      <div className="px-6 py-5 border-b border-green-600 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-green-700 font-bold text-lg shadow-md">
          WT
        </div>
        <div>
          <h2 className="font-bold text-white text-lg">
            Waste Tracker
          </h2>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.isDropdown) {
            const isOpen = openDropdown.includes(index);
            const isSubActive = checkSubActive(item.subItems);
            
            return (
              <div key={index}>
                <button
                  onClick={() => toggleDropdown(index)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isSubActive
                      ? "bg-green-800 text-white shadow-md"
                      : "text-white hover:bg-green-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-green-600 pl-4">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-sm transition-all ${
                          isActive(subItem.href)
                            ? "bg-white text-green-700 font-semibold shadow-sm"
                            : "text-green-100 hover:bg-green-600 hover:text-white"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-white text-green-700 shadow-md"
                  : "text-white hover:bg-green-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER USER */}
      <div className="border-t border-green-600 p-4 space-y-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-green-800">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold text-sm shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-green-200">
              En ligne
            </p>
          </div>
        </div>

      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-70 h-screen bg-green-700 border-r border-green-600 flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 w-64 h-screen bg-green-700 border-r border-green-600 flex flex-col shadow-2xl z-40 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}