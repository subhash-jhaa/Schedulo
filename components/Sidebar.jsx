'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Clock,
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

const SidebarContent = ({ pathname, user, handleSignOut }) => (
  <>
    <div className="p-8">
      <Link href="/" className="flex items-center gap-3 group no-underline text-slate-900">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
          <Calendar className="text-white" size={22} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black tracking-tighter">Schedulo</span>
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
  </>
);

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center"
      >
        <Menu size={20} className="text-slate-700" />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 flex flex-col z-[60] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
        >
          <X size={18} className="text-slate-500" />
        </button>
        <SidebarContent pathname={pathname} user={user} handleSignOut={handleSignOut} />
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden md:flex w-[280px] fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex-col z-50">
        <SidebarContent pathname={pathname} user={user} handleSignOut={handleSignOut} />
      </aside>
    </>
  );
}
