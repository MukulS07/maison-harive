import { NextResponse } from "next/server";
import {
  getStoreConciergeRequests,
  createStoreConciergeRequest,
  updateStoreConciergeStatus,
  type ConciergeStatus,
} from "@/lib/concierge-store";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ConciergeStatus | null;
    const query = searchParams.get("q")?.toLowerCase();

    const all = await getStoreConciergeRequests();

    let filtered = all;
    if (status && status !== ("ALL" as unknown as ConciergeStatus)) {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (query) {
      filtered = filtered.filter(
        (r) =>
          r.clientName.toLowerCase().includes(query) ||
          r.reference.toLowerCase().includes(query) ||
          (r.email && r.email.toLowerCase().includes(query)) ||
          (r.phone && r.phone.toLowerCase().includes(query)) ||
          r.serviceType.toLowerCase().includes(query)
      );
    }

    const counts = {
      total: all.length,
      pending: all.filter((r) => r.status === "PENDING").length,
      approved: all.filter((r) => r.status === "APPROVED").length,
      inReview: all.filter((r) => r.status === "IN_REVIEW").length,
      completed: all.filter((r) => r.status === "COMPLETED").length,
      declined: all.filter((r) => r.status === "DECLINED").length,
    };

    return NextResponse.json(
      {
        counts,
        total: filtered.length,
        requests: filtered,
      },
      { headers }
    );
  } catch (err) {
    console.error("[GET /api/concierge error]", err);
    return NextResponse.json({ error: "Failed to fetch concierge requests" }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    const rawName = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
    const rawType = typeof body.type === "string" ? body.type.trim().slice(0, 80) : "Private Viewing";
    const rawMessage = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
    const rawPrefDate = typeof body.prefDate === "string" ? body.prefDate.trim().slice(0, 40) : "";
    const rawPrefTime = typeof body.prefTime === "string" ? body.prefTime.trim().slice(0, 40) : "";

    const honeypot = typeof body.website === "string" ? body.website.trim() : "";
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Received.", reference: "MH-0000-XXXXX" }, { headers });
    }

    if (!rawName || rawName.length < 2 || (!rawPhone && !rawEmail)) {
      return NextResponse.json(
        { error: "A valid client name and at least one contact method (phone or email) are required." },
        { status: 400, headers }
      );
    }

    // Generate unique royal reference ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const refCode = `MH-${new Date().getFullYear()}-${randomHex}`;

    // 1. Persist directly to store (and Supabase cloud if configured)
    const stored = await createStoreConciergeRequest({
      reference: refCode,
      clientName: rawName,
      phone: rawPhone || null,
      email: rawEmail || null,
      serviceType: rawType,
      appointmentDate: rawPrefDate || null,
      appointmentTime: rawPrefTime || null,
      notes: rawMessage || null,
      status: "PENDING",
    });

    // 2. External Webhook Dispatch (Zapier, Slack, Discord, Telegram, or CRM)
    const webhookUrl = process.env.CONCIERGE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        void fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `👑 *New Maison Harivé Concierge Request* [${refCode}]\n*Client:* ${rawName}\n*Contact:* ${rawPhone || "N/A"} / ${rawEmail || "N/A"}\n*Service:* ${rawType}\n*Date/Time:* ${rawPrefDate || "Flexible"} (${rawPrefTime || "Anytime"})\n*Details:* ${rawMessage || "No notes"}`,
            booking: stored,
          }),
        }).catch((err) => {
          console.error("[Concierge Webhook Error]", err);
        });
      } catch (err) {
        console.error("[Concierge Webhook Dispatch Failed]", err);
      }
    }

    // 3. Resend Email Dispatch (if RESEND_API_KEY and recipient configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const staffEmail = process.env.CONCIERGE_NOTIFICATION_EMAIL || "concierge@maisonharive.com";
    if (resendApiKey) {
      try {
        void fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Maison Harivé Concierge <concierge@maisonharive.com>",
            to: [staffEmail],
            subject: `[${refCode}] New Concierge Request: ${rawName} (${rawType})`,
            html: `
              <div style="background-color: #0a0806; color: #efe6d2; font-family: Georgia, serif; padding: 40px; border: 1px solid #c9a45c;">
                <h1 style="color: #c9a45c; font-size: 24px; letter-spacing: 0.2em; text-transform: uppercase;">Maison Harivé</h1>
                <p style="font-size: 14px; letter-spacing: 0.15em; color: #d8cdb4; text-transform: uppercase;">Private Client Advisory Dispatch</p>
                <hr style="border: 0; border-top: 1px solid #c9a45c; margin: 20px 0;" />
                <p><strong>Reference Protocol:</strong> <span style="color: #e8c77f;">${refCode}</span></p>
                <p><strong>Client Name:</strong> ${rawName}</p>
                <p><strong>Phone / WhatsApp:</strong> ${rawPhone || "Not provided"}</p>
                <p><strong>Email:</strong> ${rawEmail || "Not provided"}</p>
                <p><strong>Service Type:</strong> ${rawType}</p>
                <p><strong>Requested Schedule:</strong> ${rawPrefDate || "Flexible"} · ${rawPrefTime || "Flexible"}</p>
                <p><strong>Curator Notes:</strong><br /><span style="font-style: italic; color: #ded4bf;">${rawMessage || "None provided"}</span></p>
                <hr style="border: 0; border-top: 1px solid rgba(201, 164, 92, 0.4); margin: 20px 0;" />
                <p style="font-size: 11px; color: #a89878; letter-spacing: 0.1em;">CONFIDENTIAL & PROPRIETARY · MAISON HARIVÉ JAIPUR & PARIS</p>
              </div>
            `,
          }),
        }).catch((err) => {
          console.error("[Resend Email Error]", err);
        });
      } catch (err) {
        console.error("[Resend Dispatch Failed]", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your private appointment request has been received by the Maison Harivé Concierge.",
        reference: refCode,
        booking: stored,
      },
      { headers }
    );
  } catch (err) {
    console.error("[POST /api/concierge error]", err);
    return NextResponse.json({ error: "Invalid request payload format." }, { status: 400, headers });
  }
}

export async function PATCH(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    const { id, reference, status, adminNotes } = body;

    const targetId = id || reference;
    if (!targetId || !status) {
      return NextResponse.json({ error: "Target ID/reference and status are required." }, { status: 400, headers });
    }

    const updated = await updateStoreConciergeStatus(targetId, status, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: "Concierge request not found." }, { status: 404, headers });
    }

    return NextResponse.json({ success: true, request: updated }, { headers });
  } catch (err) {
    console.error("[PATCH /api/concierge error]", err);
    return NextResponse.json({ error: "Failed to update concierge request." }, { status: 500, headers });
  }
}
