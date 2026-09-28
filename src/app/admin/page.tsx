"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type ConciergeRequest, type ConciergeStatus } from "@/lib/concierge-store";
import { type Product } from "@/content/products";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    inReview: 0,
    completed: 0,
    declined: 0,
  });

  // Inline price edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [updatingPrice, setUpdatingPrice] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [conciergeRes, productsRes] = await Promise.all([
        fetch("/api/concierge"),
        fetch("/api/products"),
      ]);

      if (conciergeRes.ok) {
        const cData = await conciergeRes.json();
        setRequests(cData.requests || []);
        if (cData.counts) setCounts(cData.counts);
      }

      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData.products || []);
      }
    } catch (err) {
      console.error("[Dashboard Fetch Error]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [conciergeRes, productsRes] = await Promise.all([
          fetch("/api/concierge"),
          fetch("/api/products"),
        ]);
        if (!active) return;
        if (conciergeRes.ok) {
          const cData = await conciergeRes.json();
          setRequests(cData.requests || []);
          if (cData.counts) setCounts(cData.counts);
        }
        if (productsRes.ok) {
          const pData = await productsRes.json();
          setProducts(pData.products || []);
        }
      } catch (err) {
        console.error("[Dashboard Fetch Error]", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ConciergeStatus) => {
    try {
      const res = await fetch("/api/concierge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSavePrice = async (id: string) => {
    try {
      setUpdatingPrice(true);
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: priceInput }),
      });
      if (res.ok) {
        setEditingPriceId(null);
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to save price", err);
    } finally {
      setUpdatingPrice(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[#2e261d] pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-[#e8c77f] uppercase md:text-3xl">
            Office & Vault Overview
          </h1>
          <p className="text-sm text-[#d8cdb4]/70 mt-1">
            Real-time client concierge bookings, approvals queue, and royal jewellery catalogue control.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="rounded-lg border border-[#c9a45c]/40 bg-[#1a1612] px-4 py-2 text-xs font-semibold tracking-wider text-[#e8c77f] uppercase hover:border-[#c9a45c] hover:bg-[#c9a45c]/10 transition-colors"
          >
            ↻ Refresh Data
          </button>
          <Link
            href="/admin/products"
            className="rounded-lg bg-[#c9a45c] px-4 py-2 text-xs font-bold tracking-wider text-[#0a0806] uppercase hover:bg-[#e8c77f] transition-colors shadow-[0_0_15px_rgba(201,164,92,0.2)]"
          >
            + Add Treasure
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Approvals */}
        <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-[#16120c] p-5 shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">Pending Approvals</span>
            <span className="flex size-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#efe6d2]">{counts.pending}</p>
          <p className="mt-1 text-xs text-[#a89878]">Client appointment requests waiting for review</p>
          <Link
            href="/admin/concierge?status=PENDING"
            className="mt-3 inline-block text-xs font-medium text-amber-400 hover:underline"
          >
            Open Approval Queue &rarr;
          </Link>
        </div>

        {/* Approved Appointments */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-[#0e1610] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Confirmed / Approved</span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#efe6d2]">{counts.approved}</p>
          <p className="mt-1 text-xs text-[#a89878]">Ready for private viewing & advisory</p>
          <Link
            href="/admin/concierge?status=APPROVED"
            className="mt-3 inline-block text-xs font-medium text-emerald-400 hover:underline"
          >
            View confirmed &rarr;
          </Link>
        </div>

        {/* Total Catalogue Items */}
        <div className="relative overflow-hidden rounded-xl border border-[#c9a45c]/30 bg-[#14120e] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-[#e8c77f] uppercase">Vault Treasures</span>
            <span className="size-2 rounded-full bg-[#c9a45c]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#efe6d2]">{products.length}</p>
          <p className="mt-1 text-xs text-[#a89878]">Active pieces across brooches, kalangi & pendants</p>
          <Link
            href="/admin/products"
            className="mt-3 inline-block text-xs font-medium text-[#e8c77f] hover:underline"
          >
            Manage Catalogue &rarr;
          </Link>
        </div>

        {/* Priced Pieces */}
        <div className="relative overflow-hidden rounded-xl border border-purple-500/30 bg-[#130f16] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-purple-300 uppercase">Priced Pieces</span>
            <span className="size-2 rounded-full bg-purple-400" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#efe6d2]">
            {products.filter((p) => p.price && p.price !== "Inquire").length}
          </p>
          <p className="mt-1 text-xs text-[#a89878]">
            {products.filter((p) => !p.price || p.price === "Inquire").length} set to &quot;Inquire&quot;
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-block text-xs font-medium text-purple-300 hover:underline"
          >
            Adjust prices &rarr;
          </Link>
        </div>
      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Concierge Approvals Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold tracking-wider text-[#efe6d2] uppercase">
                Concierge Approval Queue
              </h2>
              {counts.pending > 0 && (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {counts.pending} Action Needed
                </span>
              )}
            </div>
            <Link
              href="/admin/concierge"
              className="text-xs font-medium text-[#e8c77f] hover:underline"
            >
              View All ({requests.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#2e261d] bg-[#12100d]">
            {loading ? (
              <div className="p-12 text-center text-sm text-[#a89878]">Loading concierge requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#a89878]">No requests recorded yet.</div>
            ) : (
              <div className="divide-y divide-[#2e261d]/60">
                {requests.slice(0, 5).map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 hover:bg-[#1a1612]/50 transition-colors">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#c9a45c]">
                            {req.reference}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              req.status === "PENDING"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : req.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : req.status === "IN_REVIEW"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : req.status === "COMPLETED"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="text-[11px] text-[#a89878] hidden sm:inline">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="mt-1 font-serif text-base font-bold text-[#efe6d2]">
                          {req.clientName}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#a89878]">
                          <span className="text-[#efe6d2]/90 font-medium">{req.serviceType}</span>
                          {req.appointmentDate && (
                            <>
                              <span>·</span>
                              <span>📅 {req.appointmentDate} {req.appointmentTime ? `(${req.appointmentTime})` : ""}</span>
                            </>
                          )}
                          {req.phone && (
                            <>
                              <span>·</span>
                              <a
                                href={`https://wa.me/${req.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                              >
                                💬 WhatsApp
                              </a>
                            </>
                          )}
                        </div>

                        {req.notes && (
                          <p className="mt-2 text-xs italic text-[#ded4bf]/80 bg-[#181410] border-l-2 border-[#c9a45c] p-2 rounded-r">
                            &quot;{req.notes}&quot;
                          </p>
                        )}
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                              className="rounded bg-emerald-600/80 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white tracking-wide transition-colors"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "IN_REVIEW")}
                              className="rounded bg-blue-600/60 hover:bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white tracking-wide transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, "DECLINED")}
                              className="rounded bg-red-800/40 hover:bg-red-800 px-2.5 py-1.5 text-xs font-semibold text-red-200 tracking-wide transition-colors"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {req.status === "IN_REVIEW" && (
                          <button
                            onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                            className="rounded bg-emerald-600/80 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white tracking-wide transition-colors"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {req.status === "APPROVED" && (
                          <button
                            onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                            className="rounded bg-purple-600/70 hover:bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white tracking-wide transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Product Pricing Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold tracking-wider text-[#efe6d2] uppercase">
              Quick Price Editor
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-medium text-[#e8c77f] hover:underline"
            >
              Full Catalogue &rarr;
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#2e261d] bg-[#12100d] p-4">
            <p className="text-xs text-[#a89878] mb-3">
              Click any price below to update it instantly on the public website.
            </p>

            <div className="divide-y divide-[#2e261d]/50 max-h-[480px] overflow-y-auto pr-1">
              {products.slice(0, 10).map((p) => {
                const isEditing = editingPriceId === p.id;
                return (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#efe6d2] truncate">{p.name}</p>
                      <p className="text-[10px] text-[#a89878] uppercase">{p.category}</p>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="text"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          placeholder="e.g. $45,000"
                          className="w-24 rounded border border-[#c9a45c] bg-[#1c1813] px-2 py-1 text-xs text-[#efe6d2] focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSavePrice(p.id);
                            if (e.key === "Escape") setEditingPriceId(null);
                          }}
                        />
                        <button
                          disabled={updatingPrice}
                          onClick={() => handleSavePrice(p.id)}
                          className="rounded bg-[#c9a45c] px-2 py-1 text-[11px] font-bold text-black"
                        >
                          ✓
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
                          setPriceInput(p.price || "Inquire");
                        }}
                        className="rounded border border-[#c9a45c]/30 bg-[#1c1813] px-2.5 py-1 text-xs font-serif text-[#e8c77f] hover:border-[#c9a45c] hover:bg-[#c9a45c]/10 transition-colors shrink-0"
                      >
                        {p.price || "Inquire"} ✎
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
