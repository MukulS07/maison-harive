"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { getProduct, type Product } from "@/content/products";

const STORAGE_KEY = "mh_treasury_bag_v1";

let cachedRaw: string | null = null;
let cachedArray: string[] = [];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("mh_bag_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("mh_bag_change", callback);
  };
}

function getSnapshot(): string[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      if (!raw) {
        cachedArray = [];
      } else {
        const parsed = JSON.parse(raw);
        cachedArray = Array.isArray(parsed) ? parsed : [];
      }
    }
    return cachedArray;
  } catch {
    return cachedArray;
  }
}

const SERVER_SNAPSHOT: string[] = [];
function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function emitChange(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore quota errors
  }
  window.dispatchEvent(new Event("mh_bag_change"));
}

type TreasuryBagContextType = {
  bag: Product[];
  bagCount: number;
  isInBag: (id: string) => boolean;
  toggleBag: (product: Product) => void;
  addToBag: (product: Product) => void;
  removeFromBag: (id: string) => void;
  clearBag: () => void;
};

const TreasuryBagContext = createContext<TreasuryBagContextType | undefined>(undefined);

export function TreasuryBagProvider({ children }: { children: ReactNode }) {
  const bagIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isInBag = (id: string) => bagIds.includes(id);

  const addToBag = (product: Product) => {
    if (!bagIds.includes(product.id)) {
      emitChange([...bagIds, product.id]);
    }
  };

  const removeFromBag = (id: string) => {
    emitChange(bagIds.filter((itemId) => itemId !== id));
  };

  const toggleBag = (product: Product) => {
    if (isInBag(product.id)) {
      removeFromBag(product.id);
    } else {
      addToBag(product);
    }
  };

  const clearBag = () => {
    emitChange([]);
  };

  const bag = bagIds.map((id) => getProduct(id)).filter(Boolean) as Product[];

  return (
    <TreasuryBagContext.Provider
      value={{
        bag,
        bagCount: bagIds.length,
        isInBag,
        toggleBag,
        addToBag,
        removeFromBag,
        clearBag,
      }}
    >
      {children}
    </TreasuryBagContext.Provider>
  );
}

export function useTreasuryBag() {
  const context = useContext(TreasuryBagContext);
  if (!context) {
    throw new Error("useTreasuryBag must be used within a TreasuryBagProvider");
  }
  return context;
}
