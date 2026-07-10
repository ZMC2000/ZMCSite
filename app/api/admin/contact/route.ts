import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const runtime = "nodejs";

const contactJsonPath = path.join(
  process.cwd(),
  "app",
  "data",
  "contactPage.json",
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

    await writeFile(contactJsonPath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      message: "Contact page updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save Contact page data.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
