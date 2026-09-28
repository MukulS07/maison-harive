import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
      return NextResponse.json({ success: true, message: "Received.", reference: "MH-0000-XXXXX" });
    }

    if (!rawName || rawName.length < 2 || (!rawPhone && !rawEmail)) {
      return NextResponse.json(
        { error: "A valid client name and at least one contact method (phone or email) are required." },
        { status: 400 }
      );
    }

    // Generate unique royal reference ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const refCode = `MH-${new Date().getFullYear()}-${randomHex}`;

    // Structure concierge booking payload
    const booking = {
      reference: refCode,
      clientName: rawName,
      contact: { phone: rawPhone || null, email: rawEmail || null },
      serviceType: rawType,
      appointment: { date: rawPrefDate || null, time: rawPrefTime || null },
      notes: rawMessage || null,
      receivedAt: new Date().toISOString(),
      status: "CONFIRMED_PENDING_CONCIERGE",
    };

    // 1. External Webhook Dispatch (Zapier, Slack, Discord, Telegram, or CRM)
    const webhookUrl = process.env.CONCIERGE_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        void fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `👑 *New Maison Harivé Concierge Request* [${refCode}]\n*Client:* ${rawName}\n*Contact:* ${rawPhone || "N/A"} / ${rawEmail || "N/A"}\n*Service:* ${rawType}\n*Date/Time:* ${rawPrefDate || "Flexible"} (${rawPrefTime || "Anytime"})\n*Details:* ${rawMessage || "No notes"}`,
            booking,
          }),
        }).catch((err) => {
          console.error("[Concierge Webhook Error]", err);
        });
      } catch (err) {
        console.error("[Concierge Webhook Dispatch Failed]", err);
      }
    }

    // 2. Resend Email Dispatch (if RESEND_API_KEY and recipient configured)
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

    // 3. Fallback server logging for development
    console.log(
      `👑 [Concierge Dispatch Received] Ref: ${refCode} | Client: ${rawName} | Contact: ${rawPhone || rawEmail} | Service: ${rawType}`
    );

    return NextResponse.json({
      success: true,
      message: "Your private appointment request has been received by the Maison Harivé Concierge.",
      reference: refCode,
      booking,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload format." }, { status: 400 });
  }
}
