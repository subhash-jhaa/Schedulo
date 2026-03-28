'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Clock
} from "lucide-react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Availability", href: "/availability" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-[240px] fixed left-0 top-0 h-screen bg-[#111820] border-r border-white border-opacity-5 flex flex-col z-50">
      <div className="p-8 text-white">
        <Link href="/dashboard" className="flex items-center gap-3 group no-underline text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#008A6F] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,170,0.2)]">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="font-syne font-bold text-xl tracking-tight">Schedulo</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="no-underline">
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-[#00D4AA] text-black font-bold" : "text-white opacity-60 hover:opacity-100 hover:bg-white hover:bg-opacity-5"}`}>
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute inset-0 bg-[#00D4AA] rounded-xl -z-10" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-white border-opacity-5 space-y-6">
        <div className="flex items-center gap-4 px-2 text-white font-inter">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col min-w-0 font-inter">
            <span className="text-sm font-bold truncate text-white">{user?.fullName || "User"}</span>
            <span className="text-xs opacity-40 truncate text-white">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
        
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-xl transition-all border-none bg-transparent cursor-pointer">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
