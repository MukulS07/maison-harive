"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { type Product, type ProductCategory } from "@/content/products";

const CATEGORIES: { id: string; label: string }[] = [
  { id: "ALL", label: "All Categories" },
  { id: "brooches", label: "Brooches" },
  { id: "pendant", label: "Pendants" },
  { id: "kalangi", label: "Kalangi" },
  { id: "buttons", label: "Buttons" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Inline price edit
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);

  // Modal State (Add or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "brooches" as ProductCategory,
    price: "Inquire",
    tagline: "",
    typeLabel: "",
    image: "/products/the-citadel-pendant.webp",
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/products");
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: "",
      name: "",
      category: "brooches",
      price: "Inquire",
      tagline: "",
      typeLabel: "Brooch",
      image: "/products/the-citadel-pendant.webp",
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price || "Inquire",
      tagline: p.tagline || "",
      typeLabel: p.typeLabel || "",
      image: p.image || "/products/the-citadel-pendant.webp",
      featured: Boolean(p.featured),
    });
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingProduct) {
        // Update
        const res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update product");
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create product");
      }

      setModalOpen(false);
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        await fetchProducts();
      }
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleSaveInlinePrice = async (id: string) => {
    try {
      setSavingPrice(true);
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: inlinePriceValue }),
      });
      if (res.ok) {
        setEditingPriceId(null);
        await fetchProducts();
      }
    } catch (err) {
      console.error("Failed to update price", err);
    } finally {
      setSavingPrice(false);
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    try {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, featured: !p.featured }),
      });
      await fetchProducts();
    } catch (err) {
      console.error("Failed to toggle featured", err);
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.price && p.price.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [products, categoryFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#2e261d] pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-[#e8c77f] uppercase md:text-3xl">
            Catalogue & Pricing Control
          </h1>
          <p className="text-sm text-[#d8cdb4]/70 mt-1">
            Manage vault items, set bespoke prices (e.g. &quot;$45,000&quot; or &quot;Inquire&quot;), add new royal creations, or archive pieces.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="self-start rounded-lg bg-[#c9a45c] px-5 py-2.5 text-xs font-bold tracking-wider text-black uppercase hover:bg-[#e8c77f] transition-all shadow-[0_0_18px_rgba(201,164,92,0.25)]"
        >
          + Add New Treasure
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-2 pb-1 text-xs">
          {CATEGORIES.map((c) => {
            const isSelected = categoryFilter === c.id;
            const count =
              c.id === "ALL" ? products.length : products.filter((p) => p.category === c.id).length;

            return (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-[#c9a45c] text-black font-bold"
                    : "border border-[#2e261d] bg-[#14120e] text-[#efe6d2]/80 hover:border-[#c9a45c]/40"
                }`}
              >
                <span>{c.label}</span>
                <span className={`text-[10px] ${isSelected ? "text-black/60" : "text-[#a89878]"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search piece, price, or description..."
            className="w-full rounded-lg border border-[#2e261d] bg-[#14120e] px-4 py-2 text-xs text-[#efe6d2] placeholder-[#a89878]/60 focus:border-[#c9a45c] focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2 text-xs text-[#a89878] hover:text-[#efe6d2]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="rounded-xl border border-[#2e261d] bg-[#12100d] p-16 text-center text-[#a89878]">
          Loading catalogue...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2e261d] bg-[#12100d] p-16 text-center">
          <p className="font-serif text-lg text-[#e8c77f]">No treasures found matching your query.</p>
          <p className="mt-1 text-xs text-[#a89878]">Clear filters or add a new piece to the collection.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#2e261d] bg-[#12100d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#2e261d] bg-[#171410] text-[11px] font-bold tracking-wider text-[#a89878] uppercase">
                <tr>
                  <th className="py-3 px-4">Treasure</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (Click to edit)</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e261d]/60">
                {filtered.map((p) => {
                  const isEditingInline = editingPriceId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-[#1a1612]/60 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded border border-[#2e261d] bg-black">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-[#a89878]">
                                MH
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-serif text-sm font-bold text-[#efe6d2]">{p.name}</p>
                            {p.tagline && (
                              <p className="text-[11px] italic text-[#a89878] truncate max-w-xs">
                                &quot;{p.tagline}&quot;
                              </p>
                            )}
                            <span className="font-mono text-[10px] text-[#c9a45c]/80">{p.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="rounded bg-[#1f1a14] border border-[#c9a45c]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#e8c77f]">
                          {p.category}
                        </span>
                      </td>

                      {/* Price with Instant Inline Editor */}
                      <td className="py-3 px-4">
                        {isEditingInline ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={inlinePriceValue}
                              onChange={(e) => setInlinePriceValue(e.target.value)}
                              placeholder="e.g. $45,000"
                              className="w-28 rounded border border-[#c9a45c] bg-[#1c1813] px-2 py-1 text-xs text-[#efe6d2] focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveInlinePrice(p.id);
                                if (e.key === "Escape") setEditingPriceId(null);
                              }}
                            />
                            <button
                              disabled={savingPrice}
                              onClick={() => handleSaveInlinePrice(p.id)}
                              className="rounded bg-[#c9a45c] px-2 py-1 text-[11px] font-bold text-black"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="rounded border border-[#2e261d] px-1.5 py-1 text-[11px] text-[#a89878]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setInlinePriceValue(p.price || "Inquire");
                            }}
                            className="group flex items-center gap-2 rounded border border-[#c9a45c]/30 bg-[#16120e] px-3 py-1 font-serif text-xs font-semibold text-[#e8c77f] hover:border-[#c9a45c] hover:bg-[#c9a45c]/10 transition-colors"
                          >
                            <span>{p.price || "Inquire"}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#c9a45c]">
                              ✎
                            </span>
                          </button>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`size-6 rounded inline-flex items-center justify-center border text-xs font-bold transition-colors ${
                            p.featured
                              ? "border-amber-400 bg-amber-400/20 text-amber-300"
                              : "border-[#2e261d] text-[#a89878] hover:border-[#c9a45c]"
                          }`}
                        >
                          {p.featured ? "★" : "☆"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="rounded border border-[#2e261d] bg-[#1a1612] px-2.5 py-1 text-xs text-[#efe6d2] hover:border-[#c9a45c] hover:text-[#e8c77f] transition-colors"
                          >
                            Edit
                          </button>
                          {deleteConfirmId === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white"
                              >
                                Confirm Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded border border-[#2e261d] px-1.5 py-1 text-[10px] text-[#a89878]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="rounded border border-[#2e261d] bg-[#1a1612] px-2 py-1 text-xs text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Treasure Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#c9a45c]/40 bg-[#12100d] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e261d] pb-3">
              <h2 className="font-serif text-lg font-bold tracking-wider text-[#e8c77f] uppercase">
                {editingProduct ? "Edit Vault Treasure" : "Add New Vault Treasure"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#a89878] hover:text-[#efe6d2] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#a89878] uppercase mb-1">
                  Treasure Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Emerald Pendant"
                  className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-sm text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#a89878] uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ProductCategory })
                    }
                    className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-xs text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
                  >
                    <option value="brooches">Brooches</option>
                    <option value="pendant">Pendant</option>
                    <option value="kalangi">Kalangi</option>
                    <option value="buttons">Buttons</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#a89878] uppercase mb-1">
                    Price (or &quot;Inquire&quot;)
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. $45,000 or Inquire"
                    className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-xs text-[#e8c77f] font-semibold focus:border-[#c9a45c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#a89878] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Built to protect what matters."
                  className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-xs text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#a89878] uppercase mb-1">
                    Type Label
                  </label>
                  <input
                    type="text"
                    value={formData.typeLabel}
                    onChange={(e) => setFormData({ ...formData, typeLabel: e.target.value })}
                    placeholder="e.g. Brooch / Kalangi"
                    className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-xs text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#a89878] uppercase mb-1">
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/products/the-citadel-pendant.webp"
                    className="w-full rounded-lg border border-[#2e261d] bg-[#1a1612] px-3 py-2 text-xs text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featured-checkbox"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="size-4 accent-[#c9a45c]"
                />
                <label htmlFor="featured-checkbox" className="text-xs text-[#efe6d2] cursor-pointer">
                  Feature this piece on homepage strands and highlights
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2e261d]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#2e261d] px-4 py-2 text-xs text-[#a89878] hover:text-[#efe6d2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#c9a45c] px-5 py-2 text-xs font-bold text-black uppercase hover:bg-[#e8c77f] transition-colors"
                >
                  {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Treasure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
