"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils/format";
import { adminNavSections, SITE_CONFIG, type NavItem } from "../../lib/constants";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(["Tổng quan"])
  );
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(
    () => new Set()
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const toggleChildren = (title: string) => {
    setExpandedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href.split("?")[0]);
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const Icon = item.icon;
    const childExpanded = expandedChildren.has(item.title);

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleChildren(item.title)}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
              active
                ? "bg-brand-500/10 text-brand-500"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
              depth > 0 && "ml-6"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            {childExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {childExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
          active
            ? "bg-brand-500/10 text-brand-500"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
          depth > 0 && "ml-6"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.title}</span>
        {active && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col bg-slate-900 text-slate-200 sidebar-transition",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-white">
                {SITE_CONFIG.name}
              </span>
              <span className="ml-1 text-xs text-slate-400">Admin</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-6">
            {adminNavSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
                >
                  <span>{section.title}</span>
                  {expandedSections.has(section.title) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                {expandedSections.has(section.title) && (
                  <div className="mt-1 space-y-1">
                    {section.items.map((item) => renderNavItem(item))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>NeoBóc Ecommerce</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
