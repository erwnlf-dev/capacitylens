// FILE: src/app/dashboard/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Ringkasan', path: '/dashboard' },
    { name: 'Metrik & Entitas', path: '/dashboard/entities' },
    { name: 'Pengaturan', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col p-6">
        <div className="mb-8">
          <Link href="/dashboard" className="text-xl font-bold tracking-wider text-emerald-400">
            CapacityLens
          </Link>
          <div className="text-xs text-slate-500 mt-1">SLA & Capacity Planner</div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium border-l-2 border-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          <div>Mitra Cloud Indonesia</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur">
          <h1 className="text-sm font-semibold text-slate-300">
            {menuItems.find((item) => item.path === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ID Region
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 text-slate-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
