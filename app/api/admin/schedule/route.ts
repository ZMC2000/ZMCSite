import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const runtime = "nodejs";

const scheduleJsonPath = path.join(
  process.cwd(),
  "app",
  "data",
  "schedulePage.json",
);

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

    await writeFile(scheduleJsonPath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      message: "Schedule page updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save Schedule page data.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
