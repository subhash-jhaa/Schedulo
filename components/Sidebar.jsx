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
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Availability", href: "/availability" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-[280px] fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group no-underline text-slate-900">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="font-syne font-bold text-xl tracking-tight">Schedulo</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 relative">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="no-underline block group">
              <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                ? "text-brand bg-brand/5" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}>
                <item.icon size={20} className={isActive ? "text-brand" : "text-slate-400 group-hover:text-brand transition-colors"} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute inset-0 border border-brand/10 rounded-2xl -z-10" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-100 bg-slate-50/50 space-y-6 relative">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand font-black text-lg shadow-sm">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black truncate text-slate-900 uppercase tracking-wider">
              {user?.user_metadata?.full_name || "User"}
            </span>
            <span className="text-[10px] text-slate-500 font-bold truncate tracking-tight">{user?.email}</span>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full h-14 flex items-center gap-3 px-5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100 bg-transparent cursor-pointer font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
