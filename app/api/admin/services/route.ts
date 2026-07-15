import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { saveEnglishAndSyncArabic } from "@/app/lib/sync-arabic-data";

export const runtime = "nodejs";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    const body = await request.json();

    await saveEnglishAndSyncArabic("servicesPage.json", body);

    return NextResponse.json({
      message: "Services page updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save Services page data.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
