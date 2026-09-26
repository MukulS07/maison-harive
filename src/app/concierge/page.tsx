import type { Metadata } from "next";
import { Suspense } from "react";
import { ConciergeView } from "@/components/concierge/ConciergeView";

export const metadata: Metadata = {
  title: "The Concierge · Bespoke Services · Maison Harivé",
  description:
    "Private salon appointments, custom royal jewellery commissions, styling consultations, and WhatsApp advisory at Maison Harivé.",
};

export default function ConciergePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-black" />}>
      <ConciergeView />
    </Suspense>
  );
}
