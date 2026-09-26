import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, type, message, prefDate, prefTime } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: "Name and at least one contact method (phone or email) are required." },
        { status: 400 }
      );
    }

    // Generate unique royal reference ID
    const refCode = `MH-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Structure concierge booking payload
    const booking = {
      reference: refCode,
      clientName: name,
      contact: { phone, email },
      serviceType: type || "Private Viewing",
      appointment: { date: prefDate, time: prefTime },
      notes: message,
      receivedAt: new Date().toISOString(),
      status: "CONFIRMED_PENDING_CONCIERGE",
    };

    return NextResponse.json({
      success: true,
      message: "Your private appointment request has been received by the Maison Harivé Concierge.",
      booking,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
