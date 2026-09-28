"use client";

import { useEffect, useState, useMemo } from "react";
import { type ConciergeRequest, type ConciergeStatus } from "@/lib/concierge-store";

const STATUS_TABS = [
  { id: "ALL", label: "All Requests" },
  { id: "PENDING", label: "Pending Approval" },
  { id: "APPROVED", label: "Approved" },
  { id: "IN_REVIEW", label: "In Review" },
  { id: "COMPLETED", label: "Completed" },
  { id: "DECLINED", label: "Declined" },
] as const;

export default function AdminConciergePage() {
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    inReview: 0,
    completed: 0,
    declined: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");

  // Admin notes draft state: { [id]: string }
  const [adminNotesDraft, setAdminNotesDraft] = useState<Record<string, string>>({});
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/concierge");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        if (data.counts) setCounts(data.counts);

        // populate notes draft
        const notesMap: Record<string, string> = {};
        for (const r of data.requests || []) {
          notesMap[r.id] = r.adminNotes || "";
        }
        setAdminNotesDraft(notesMap);
      }
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/concierge");
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
          if (data.counts) setCounts(data.counts);

          const notesMap: Record<string, string> = {};
          for (const r of data.requests || []) {
            notesMap[r.id] = r.adminNotes || "";
          }
          setAdminNotesDraft(notesMap);
        }
      } catch (err) {
        console.error("Failed to load requests", err);
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
        await fetchRequests();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      setSavingNotesId(id);
      const res = await fetch("/api/concierge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: requests.find((r) => r.id === id)?.status || "PENDING",
          adminNotes: adminNotesDraft[id] || "",
        }),
      });
      if (res.ok) {
        await fetchRequests();
      }
    } catch (err) {
      console.error("Failed to save admin notes", err);
    } finally {
      setSavingNotesId(null);
    }
  };

  // Filter requests
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (activeTab !== "ALL" && r.status !== activeTab) return false;
      if (serviceFilter !== "ALL" && r.serviceType !== serviceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          r.clientName.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.phone && r.phone.toLowerCase().includes(q)) ||
          (r.notes && r.notes.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [requests, activeTab, serviceFilter, search]);

  const uniqueServices = useMemo(() => {
    const set = new Set(requests.map((r) => r.serviceType));
    return Array.from(set);
  }, [requests]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#2e261d] pb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-[#e8c77f] uppercase md:text-3xl">
            Concierge Approvals & Advisory
          </h1>
          <p className="text-sm text-[#d8cdb4]/70 mt-1">
            Review incoming royal bookings, private viewing inquiries, approve appointments, and coordinate client advisory.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="self-start rounded-lg border border-[#c9a45c]/40 bg-[#1a1612] px-4 py-2 text-xs font-semibold tracking-wider text-[#e8c77f] uppercase hover:border-[#c9a45c] hover:bg-[#c9a45c]/10 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#2e261d]/80 pb-3 text-xs">
        {STATUS_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          let count = counts.total;
          if (tab.id === "PENDING") count = counts.pending;
          if (tab.id === "APPROVED") count = counts.approved;
          if (tab.id === "IN_REVIEW") count = counts.inReview;
          if (tab.id === "COMPLETED") count = counts.completed;
          if (tab.id === "DECLINED") count = counts.declined;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium tracking-wide whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#c9a45c] text-black font-bold shadow-[0_0_12px_rgba(201,164,92,0.25)]"
                  : "border border-[#2e261d] bg-[#12100d] text-[#efe6d2]/80 hover:border-[#c9a45c]/40 hover:text-[#e8c77f]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isSelected ? "bg-black/20 text-black" : "bg-[#1c1813] text-[#a89878]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, reference code, email, phone..."
            className="w-full rounded-lg border border-[#2e261d] bg-[#14120e] px-4 py-2.5 text-xs text-[#efe6d2] placeholder-[#a89878]/60 focus:border-[#c9a45c] focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-xs text-[#a89878] hover:text-[#efe6d2]"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-[#a89878]">Service Type:</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-lg border border-[#2e261d] bg-[#14120e] px-3 py-2 text-xs text-[#efe6d2] focus:border-[#c9a45c] focus:outline-none"
          >
            <option value="ALL">All Services</option>
            {uniqueServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="rounded-xl border border-[#2e261d] bg-[#12100d] p-16 text-center text-[#a89878]">
          Loading concierge requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2e261d] bg-[#12100d] p-16 text-center">
          <p className="font-serif text-lg text-[#e8c77f]">No concierge requests match this filter.</p>
          <p className="mt-1 text-xs text-[#a89878]">Try changing your search terms or filter status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const waNumber = req.phone ? req.phone.replace(/[^0-9]/g, "") : "";
            const waText = encodeURIComponent(
              `Bonjour ${req.clientName}, this is the Maison Harivé Private Concierge regarding your appointment request [${req.reference}].`
            );

            return (
              <div
                key={req.id}
                className="overflow-hidden rounded-xl border border-[#2e261d] bg-[#12100d] p-5 sm:p-6 transition-all hover:border-[#c9a45c]/50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Column: Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#c9a45c] bg-[#1c1813] px-2.5 py-1 rounded border border-[#c9a45c]/30">
                        {req.reference}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          req.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : req.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : req.status === "IN_REVIEW"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            : req.status === "COMPLETED"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-xs text-[#a89878]">
                        Received: {new Date(req.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#efe6d2]">{req.clientName}</h2>
                      <p className="text-xs font-medium text-[#e8c77f] uppercase tracking-wider mt-0.5">
                        {req.serviceType}
                      </p>
                    </div>

                    {/* Schedule */}
                    <div className="rounded-lg border border-[#2e261d]/80 bg-[#161310] p-3 text-xs text-[#efe6d2]/90 flex flex-wrap gap-4">
                      <div>
                        <span className="text-[#a89878] block text-[10px] uppercase">Requested Date</span>
                        <span className="font-medium">{req.appointmentDate || "Flexible / Not specified"}</span>
                      </div>
                      <div className="border-l border-[#2e261d] pl-4">
                        <span className="text-[#a89878] block text-[10px] uppercase">Preferred Time</span>
                        <span className="font-medium">{req.appointmentTime || "Flexible / Anytime"}</span>
                      </div>
                    </div>

                    {/* Client Inquiry / Notes */}
                    {req.notes && (
                      <div className="rounded-lg bg-[#181410] border-l-2 border-[#c9a45c] p-3 text-xs text-[#ded4bf]">
                        <span className="text-[10px] font-bold text-[#c9a45c] uppercase block mb-1">
                          Client Advisory Notes
                        </span>
                        <p className="italic whitespace-pre-line">&quot;{req.notes}&quot;</p>
                      </div>
                    )}

                    {/* Contact Channels */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {req.phone && (
                        <>
                          <a
                            href={`https://wa.me/${waNumber}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          >
                            <span>💬 Message on WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${req.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#2e261d] bg-[#1a1612] px-3 py-1.5 text-xs text-[#efe6d2] hover:border-[#c9a45c] transition-colors"
                          >
                            <span>📞 Call {req.phone}</span>
                          </a>
                        </>
                      )}
                      {req.email && (
                        <a
                          href={`mailto:${req.email}?subject=Maison Harivé Concierge - Ref [${req.reference}]`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#2e261d] bg-[#1a1612] px-3 py-1.5 text-xs text-[#efe6d2] hover:border-[#c9a45c] transition-colors"
                        >
                          <span>✉ Email {req.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status Controls & Internal Curator Notes */}
                  <div className="w-full lg:w-72 shrink-0 space-y-4 rounded-lg border border-[#2e261d]/80 bg-[#171410] p-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-[#a89878] uppercase">
                        Change Approval Status
                      </label>
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value as ConciergeStatus)}
                        className="w-full rounded-md border border-[#c9a45c]/40 bg-[#12100d] px-3 py-2 text-xs font-bold text-[#e8c77f] focus:border-[#c9a45c] focus:outline-none"
                      >
                        <option value="PENDING">PENDING (Awaiting Review)</option>
                        <option value="APPROVED">APPROVED (Confirmed)</option>
                        <option value="IN_REVIEW">IN REVIEW (Client Contacted)</option>
                        <option value="COMPLETED">COMPLETED (Session Finished)</option>
                        <option value="DECLINED">DECLINED</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold tracking-wider text-[#a89878] uppercase">
                        Internal Curator Notes
                      </label>
                      <textarea
                        rows={2}
                        value={adminNotesDraft[req.id] || ""}
                        onChange={(e) =>
                          setAdminNotesDraft((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        placeholder="Private notes (e.g. assigned curator, confirmed room)..."
                        className="w-full rounded-md border border-[#2e261d] bg-[#12100d] p-2 text-xs text-[#efe6d2] placeholder-[#a89878]/50 focus:border-[#c9a45c] focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveNotes(req.id)}
                        disabled={savingNotesId === req.id}
                        className="mt-1.5 w-full rounded bg-[#c9a45c]/20 hover:bg-[#c9a45c]/40 border border-[#c9a45c]/50 py-1 text-[11px] font-semibold text-[#e8c77f] transition-colors"
                      >
                        {savingNotesId === req.id ? "Saving..." : "Save Curator Note"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
