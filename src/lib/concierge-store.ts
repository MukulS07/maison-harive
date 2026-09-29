import fs from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export type ConciergeStatus = "PENDING" | "APPROVED" | "IN_REVIEW" | "COMPLETED" | "DECLINED";

export type ConciergeRequest = {
  id: string;
  reference: string;
  clientName: string;
  phone: string | null;
  email: string | null;
  serviceType: string;
  appointmentDate: string | null;
  appointmentTime: string | null;
  notes: string | null;
  status: ConciergeStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const CONCIERGE_FILE = path.join(DATA_DIR, "concierge_requests.json");

const INITIAL_REQUESTS: ConciergeRequest[] = [
  {
    id: "req-1",
    reference: "MH-2026-8A3F1",
    clientName: "Princess Gayatri Devi of Marwar",
    phone: "+91 98290 11223",
    email: "gayatri.devi@marwar.org",
    serviceType: "Private Viewing",
    appointmentDate: "2026-10-05",
    appointmentTime: "Afternoon (2:00 PM - 5:00 PM)",
    notes: "Interested in inspecting The Citadel Pendant and custom emerald ceremonial suite for upcoming royal jubilee.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "req-2",
    reference: "MH-2026-9B4E2",
    clientName: "Arthur de Saint-Germain",
    phone: "+33 6 12 34 56 78",
    email: "arthur.stgermain@luxury-paris.fr",
    serviceType: "Bespoke Royal Commission",
    appointmentDate: "2026-10-12",
    appointmentTime: "Morning (10:00 AM - 1:00 PM)",
    notes: "Commissioning a custom sapphire and old-mine cut diamond kalangi for upcoming gala in Monaco.",
    status: "IN_REVIEW",
    adminNotes: "Client contacted via WhatsApp. Awaiting rough gemstone sketches from Jaipur atelier.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "req-3",
    reference: "MH-2026-4C1D9",
    clientName: "Rohit Singhania",
    phone: "+91 98111 88442",
    email: "rohit@singhaniagroup.com",
    serviceType: "Private Viewing",
    appointmentDate: "2026-09-30",
    appointmentTime: "Evening (5:00 PM - 8:00 PM)",
    notes: "Viewing at Jaipur Atelier for heirloom bridal acquisition.",
    status: "APPROVED",
    adminNotes: "Viewing confirmed with Head Curator for 6:00 PM.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "req-4",
    reference: "MH-2026-7E5A8",
    clientName: "Lady Elena Rostova",
    phone: "+44 7700 900123",
    email: "elena.rostova@mayfair.co.uk",
    serviceType: "Jewellery Styling Consultation",
    appointmentDate: "2026-10-20",
    appointmentTime: "Flexible",
    notes: "Bespoke brooches styling for private anniversary reception at Ritz Paris.",
    status: "COMPLETED",
    adminNotes: "Successfully styled with Maniratna Brooch.",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

function ensureLocalFile(): ConciergeRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CONCIERGE_FILE)) {
      fs.writeFileSync(CONCIERGE_FILE, JSON.stringify(INITIAL_REQUESTS, null, 2), "utf-8");
      return INITIAL_REQUESTS;
    }
    const raw = fs.readFileSync(CONCIERGE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Concierge Store] Error reading local file:", err);
    return INITIAL_REQUESTS;
  }
}

function saveLocal(items: ConciergeRequest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONCIERGE_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("[Concierge Store] Error writing local file:", err);
  }
}

export async function getStoreConciergeRequests(): Promise<ConciergeRequest[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("concierge_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          reference: row.reference,
          clientName: row.client_name,
          phone: row.phone,
          email: row.email,
          serviceType: row.service_type,
          appointmentDate: row.appointment_date,
          appointmentTime: row.appointment_time,
          notes: row.notes,
          status: (row.status as ConciergeStatus) || "PENDING",
          adminNotes: row.admin_notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      }
    }
  }

  return ensureLocalFile();
}

export async function createStoreConciergeRequest(
  input: Omit<ConciergeRequest, "id" | "createdAt" | "updatedAt" | "status"> & { status?: ConciergeStatus }
): Promise<ConciergeRequest> {
  const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const item: ConciergeRequest = {
    id,
    reference: input.reference,
    clientName: input.clientName,
    phone: input.phone,
    email: input.email,
    serviceType: input.serviceType,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    notes: input.notes,
    status: input.status || "PENDING",
    adminNotes: null,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("concierge_requests").insert({
        reference: item.reference,
        client_name: item.clientName,
        phone: item.phone,
        email: item.email,
        service_type: item.serviceType,
        appointment_date: item.appointmentDate,
        appointment_time: item.appointmentTime,
        notes: item.notes,
        status: item.status,
      });
    }
  }

  const local = ensureLocalFile();
  local.unshift(item);
  saveLocal(local);

  return item;
}

export async function updateStoreConciergeStatus(
  idOrReference: string,
  status: ConciergeStatus,
  adminNotes?: string
): Promise<ConciergeRequest | null> {
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const updatePayload: Record<string, unknown> = { status, updated_at: updatedAt };
      if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

      const { data, error } = await supabase
        .from("concierge_requests")
        .update(updatePayload)
        .or(`id.eq.${idOrReference},reference.eq.${idOrReference}`)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[Concierge Store] Supabase update failed:", error);
      } else if (data) {
        return {
          id: data.id,
          reference: data.reference,
          clientName: data.client_name,
          phone: data.phone,
          email: data.email,
          serviceType: data.service_type,
          appointmentDate: data.appointment_date,
          appointmentTime: data.appointment_time,
          notes: data.notes,
          status: (data.status as ConciergeStatus) || "PENDING",
          adminNotes: data.admin_notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  }

  // Local fallback — only reached when Supabase is unconfigured or the row lives solely in the local file.
  const local = ensureLocalFile();
  const index = local.findIndex((r) => r.id === idOrReference || r.reference === idOrReference);
  if (index === -1) return null;

  local[index].status = status;
  if (adminNotes !== undefined) {
    local[index].adminNotes = adminNotes;
  }
  local[index].updatedAt = updatedAt;
  saveLocal(local);
  return local[index];
}
