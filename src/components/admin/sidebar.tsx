"use client";

import { useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils/format";
import { adminNavSections, SITE_CONFIG, type NavItem } from "../../lib/constants";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();
  const currentParams = useMemo(
    () => new URLSearchParams(currentQuery),
    [currentQuery]
  );

  const isActive = useCallback((href?: string) => {
    if (!href) return false;

    const [targetPath, queryString] = href.split("?");
    if (targetPath === "/admin") return pathname === "/admin";

    if (!queryString) {
      return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
    }

    if (pathname !== targetPath) return false;

    const targetParams = new URLSearchParams(queryString);
    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) return false;
    }

    return true;
  }, [currentParams, pathname]);

  const { expandedSections, expandedChildren } = useMemo(() => {
    const sectionSet = new Set<string>();
    const childSet = new Set<string>();

    const collectActiveBranch = (items: NavItem[], parentKey: string): boolean => {
      let hasActiveItem = false;

      items.forEach((item) => {
        const itemKey = `${parentKey}/${item.title}`;
        const selfActive = isActive(item.href);
        const childActive = item.children?.length
          ? collectActiveBranch(item.children, itemKey)
          : false;

        if (item.children?.length && childActive) {
          childSet.add(itemKey);
        }

        if (selfActive || childActive) {
          hasActiveItem = true;
        }
      });

      return hasActiveItem;
    };

    adminNavSections.forEach((section) => {
      if (collectActiveBranch(section.items, section.title)) {
        sectionSet.add(section.title);
      }
    });

    return {
      expandedSections: sectionSet,
      expandedChildren: childSet,
    };
  }, [isActive]);

  const renderNavItem = (
    item: NavItem,
    depth: number = 0,
    parentKey: string = ""
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const isLevel3Leaf = !hasChildren && depth > 0;
    const active = isActive(item.href);
    const Icon = item.icon;
    const itemKey = `${parentKey}/${item.title}`;
    const childExpanded = expandedChildren.has(itemKey);
    const itemRowClassName = cn(
      "flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
      isLevel3Leaf
        ? active
          ? "text-brand-500"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        : active
          ? "bg-brand-500/10 text-brand-500"
          : "text-slate-300 hover:bg-slate-800 hover:text-white",
      depth > 0 && "ml-6"
    );

    if (hasChildren) {
      return (
        <div key={itemKey}>
          {item.href ? (
            <div className={itemRowClassName}>
              <Link
                href={item.href}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </Link>
              <motion.span
                className="inline-flex rounded-md p-1 text-slate-400"
                animate={{ rotate: childExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.span>
            </div>
          ) : (
            <div className={itemRowClassName}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              <motion.span
                className="inline-flex"
                animate={{ rotate: childExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.span>
            </div>
          )}
          <AnimatePresence initial={false}>
            {childExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="mt-1 space-y-1 overflow-hidden"
              >
                {item.children!.map((child) =>
                  renderNavItem(child, depth + 1, itemKey)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        key={itemKey}
        href={item.href || "#"}
        className={itemRowClassName}
      >
        {isLevel3Leaf && (
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
        )}
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{item.title}</span>
        {active && !isLevel3Leaf && (
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
        <nav className="hide-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {adminNavSections.map((section) => (
              <div key={section.title}>
                <div className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <span>{section.title}</span>
                  <motion.span
                    className="inline-flex"
                    animate={{ rotate: expandedSections.has(section.title) ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {expandedSections.has(section.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="mt-1 space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) =>
                        renderNavItem(item, 0, section.title)
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
