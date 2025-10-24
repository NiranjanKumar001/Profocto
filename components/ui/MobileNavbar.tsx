"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaOctopusDeploy } from "react-icons/fa";

interface MobileNavbarProps {
  className?: string;
}

export default function MobileNavbar({ className = "" }: MobileNavbarProps) {
  const { data: session } = useSession();

  return (
    <div
      className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-[hsl(240_10%_3.9%)] border-b border-[hsl(240_3.7%_15.9%)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${className}`}
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

        {/* Profile Picture */}
        <div className="relative">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-pink-500/30 overflow-hidden transition-transform hover:scale-105"
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
        </div>
      </div>
    </div>
  );
}
