import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "supabase-schema.sql");
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Schema file not found", { status: 404 });
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Error reading schema file", { status: 500 });
  }
}
