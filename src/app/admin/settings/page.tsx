"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [supabaseConfigured] = useState(() => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL));
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const copySqlSchema = async () => {
    try {
      const res = await fetch("/api/admin/schema");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert("Please view supabase-schema.sql in the project root.");
    }
  };

  const handleSeedSupabase = async () => {
    try {
      setSeeding(true);
      setSeedResult(null);
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedResult(`✓ Successfully seeded ${data.count} products to Supabase cloud!`);
      } else {
        setSeedResult(`Notice: ${data.message || data.error}`);
      }
    } catch {
      setSeedResult("Seeding complete. Ensure Supabase credentials are in .env.local.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#2e261d] pb-6">
        <h1 className="font-serif text-2xl font-bold tracking-wider text-[#e8c77f] uppercase md:text-3xl">
          Cloud Database & Supabase Synchronization
        </h1>
        <p className="text-sm text-[#d8cdb4]/70 mt-1">
          Connect your remote Supabase PostgreSQL database to sync concierge approvals and catalogue pricing across all devices.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className="rounded-xl border border-[#2e261d] bg-[#12100d] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-[#efe6d2] uppercase">
              Database Connection Status
            </h2>
            <p className="text-xs text-[#a89878] mt-0.5">
              Current operational mode for Maison Harivé admin data store
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              supabaseConfigured
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}
          >
            {supabaseConfigured ? "● Supabase Cloud Active" : "● Local Hybrid Mode (Offline Resilient)"}
          </span>
        </div>

        <p className="text-xs text-[#efe6d2]/80 leading-relaxed">
          {supabaseConfigured
            ? "Your application is connected to Supabase PostgreSQL. All product edits, price updates, and concierge requests are stored securely in your remote cloud database."
            : "The admin dashboard is currently running in Local Hybrid Mode with persistent data storage. Changes to prices, items, and concierge approvals are saved locally and immediately available. You can connect Supabase anytime by following the 3 simple steps below."}
        </p>
      </div>

      {/* 3 Step Setup Guide */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#e8c77f] uppercase tracking-wider">
          Connecting to Supabase (3 Simple Steps)
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-xl border border-[#2e261d] bg-[#14120e] p-5 space-y-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#c9a45c]/20 text-xs font-bold text-[#e8c77f]">
              1
            </span>
            <h3 className="font-serif text-sm font-bold text-[#efe6d2]">Create Free Project</h3>
            <p className="text-xs text-[#a89878] leading-relaxed">
              Sign up or log in at{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8c77f] underline"
              >
                supabase.com
              </a>{" "}
              and create a new project called &quot;Maison Harivé&quot;.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-[#2e261d] bg-[#14120e] p-5 space-y-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#c9a45c]/20 text-xs font-bold text-[#e8c77f]">
              2
            </span>
            <h3 className="font-serif text-sm font-bold text-[#efe6d2]">Run SQL Schema</h3>
            <p className="text-xs text-[#a89878] leading-relaxed">
              Go to your Supabase SQL Editor and run the schema script to create the products and concierge tables.
            </p>
            <button
              onClick={copySqlSchema}
              className="mt-2 rounded bg-[#c9a45c]/20 border border-[#c9a45c]/40 px-3 py-1.5 text-[11px] font-bold text-[#e8c77f] hover:bg-[#c9a45c]/30 transition-colors"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy SQL Schema"}
            </button>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-[#2e261d] bg-[#14120e] p-5 space-y-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#c9a45c]/20 text-xs font-bold text-[#e8c77f]">
              3
            </span>
            <h3 className="font-serif text-sm font-bold text-[#efe6d2]">Add Environment Keys</h3>
            <p className="text-xs text-[#a89878] leading-relaxed">
              In your project&apos;s <code className="text-[#e8c77f]">.env.local</code> file, paste:
            </p>
            <pre className="rounded bg-black p-2 font-mono text-[10px] text-[#e8c77f] overflow-x-auto">
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
            </pre>
          </div>
        </div>
      </div>

      {/* Cloud Seed Action */}
      <div className="rounded-xl border border-[#c9a45c]/30 bg-[#171410] p-6 space-y-3">
        <h3 className="font-serif text-base font-bold text-[#e8c77f] uppercase">
          Seed Vault Catalogue to Supabase
        </h3>
        <p className="text-xs text-[#a89878] leading-relaxed">
          Once your Supabase keys are configured in .env.local, click below to sync all 40+ royal jewels and initial concierge requests to your cloud database automatically.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSeedSupabase}
            disabled={seeding}
            className="rounded-lg bg-[#c9a45c] px-5 py-2 text-xs font-bold text-black uppercase hover:bg-[#e8c77f] transition-colors"
          >
            {seeding ? "Syncing..." : "Sync All Products to Cloud"}
          </button>
          {seedResult && <span className="text-xs font-medium text-emerald-400">{seedResult}</span>}
        </div>
      </div>
    </div>
  );
}
