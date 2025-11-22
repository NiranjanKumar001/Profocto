"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { FaOctopusDeploy, FaCog } from "react-icons/fa";
import { MdLogout, MdEmail } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import SavingIndicator from "./SavingIndicator";

interface MobileNavbarProps {
  className?: string;
  onSettingsClick?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export default function MobileNavbar({ className = "", onSettingsClick, isSaving, lastSaved }: MobileNavbarProps) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    setShowDropdown(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-[hsl(240_10%_3.9%)] border-b border-[hsl(240_3.7%_15.9%)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] exclude-print ${className}`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo and Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <FaOctopusDeploy className="text-pink-500 text-2xl sm:text-3xl animate-pulse" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-200 tracking-wide">
            Profocto
          </h1>
        </div>

        {/* Center - Saving Indicator (visible on larger mobile screens) */}
        {isSaving !== undefined && lastSaved !== undefined && (
          <div className="hidden sm:block">
            <SavingIndicator isSaving={isSaving} lastSaved={lastSaved} />
          </div>
        )}

        {/* Settings and Profile */}
        <div className="flex items-center gap-3">
          {/* Settings Button */}
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              aria-label="Settings"
            >
              <FaCog className="text-gray-400 hover:text-pink-500 text-lg sm:text-xl transition-colors" />
            </button>
          )}

          {/* Profile Picture */}
          <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-pink-500/30 overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, hsl(322, 84%, 60%) 0%, hsl(270, 84%, 60%) 100%)",
            }}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={44}
                height={44}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-[hsl(240_10%_3.9%)] animate-pulse"
          ></div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[hsl(240_10%_3.9%)] border border-[hsl(240_3.7%_15.9%)] rounded-lg shadow-xl overflow-hidden z-50">
              {/* User Info */}
              <div className="p-4 border-b border-[hsl(240_3.7%_15.9%)]">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-pink-500/30"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(322, 84%, 60%) 0%, hsl(270, 84%, 60%) 100%)",
                    }}
                  >
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xl">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                      <MdEmail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{session?.user?.email || "No email"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center gap-3 text-left text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <MdLogout className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
