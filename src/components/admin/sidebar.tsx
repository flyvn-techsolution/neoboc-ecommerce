"use client";

import { useEffect, useState } from "react";
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

const SIDEBAR_SECTIONS_STORAGE_KEY = "admin_sidebar_expanded_sections_v1";
const SIDEBAR_CHILDREN_STORAGE_KEY = "admin_sidebar_expanded_children_v1";

const ALL_SECTION_TITLES = adminNavSections.map((section) => section.title);

const collectExpandableChildKeys = (
  items: NavItem[],
  parentKey: string
): string[] => {
  const keys: string[] = [];

  items.forEach((item) => {
    if (!item.children || item.children.length === 0) {
      return;
    }

    const itemKey = `${parentKey}/${item.title}`;
    keys.push(itemKey);
    keys.push(...collectExpandableChildKeys(item.children, itemKey));
  });

  return keys;
};

const ALL_EXPANDABLE_CHILD_KEYS = adminNavSections.flatMap((section) =>
  collectExpandableChildKeys(section.items, section.title)
);

const parseStoredArray = (rawValue: string | null): string[] | null => {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return null;
  }
};

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(ALL_SECTION_TITLES)
  );
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(
    () => new Set(ALL_EXPANDABLE_CHILD_KEYS)
  );
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);

  useEffect(() => {
    const storedSections = parseStoredArray(
      localStorage.getItem(SIDEBAR_SECTIONS_STORAGE_KEY)
    );
    if (storedSections) {
      const allowedSections = new Set(ALL_SECTION_TITLES);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedSections(
        new Set(storedSections.filter((title) => allowedSections.has(title)))
      );
    }

    const storedChildren = parseStoredArray(
      localStorage.getItem(SIDEBAR_CHILDREN_STORAGE_KEY)
    );
    if (storedChildren) {
      const allowedChildren = new Set(ALL_EXPANDABLE_CHILD_KEYS);
      setExpandedChildren(
        new Set(storedChildren.filter((key) => allowedChildren.has(key)))
      );
    }

    setHasRestoredFromStorage(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredFromStorage) return;
    localStorage.setItem(
      SIDEBAR_SECTIONS_STORAGE_KEY,
      JSON.stringify(Array.from(expandedSections))
    );
  }, [expandedSections, hasRestoredFromStorage]);

  useEffect(() => {
    if (!hasRestoredFromStorage) return;
    localStorage.setItem(
      SIDEBAR_CHILDREN_STORAGE_KEY,
      JSON.stringify(Array.from(expandedChildren))
    );
  }, [expandedChildren, hasRestoredFromStorage]);

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

  const toggleChildren = (key: string) => {
    setExpandedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isActive = (href?: string) => {
    if (!href) return false;

    const [targetPath, queryString] = href.split("?");
    if (targetPath === "/admin") return pathname === "/admin";

    if (!queryString) {
      return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
    }

    if (pathname !== targetPath) return false;

    const targetParams = new URLSearchParams(queryString);
    for (const [key, value] of targetParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }

    return true;
  };

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
              <button
                type="button"
                onClick={() => toggleChildren(itemKey)}
                aria-label={childExpanded ? "Thu gọn menu con" : "Mở rộng menu con"}
                aria-expanded={childExpanded}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <motion.span
                  className="inline-flex"
                  animate={{ rotate: childExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => toggleChildren(itemKey)}
              className={itemRowClassName}
              aria-expanded={childExpanded}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              <motion.span
                className="inline-flex"
                animate={{ rotate: childExpanded ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.span>
            </button>
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
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300"
                >
                  <span>{section.title}</span>
                  <motion.span
                    className="inline-flex"
                    animate={{ rotate: expandedSections.has(section.title) ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </motion.span>
                </button>
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
