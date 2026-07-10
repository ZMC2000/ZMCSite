import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const runtime = "nodejs";

const fileMap: Record<string, string> = {
  homeHeader: "header.json",
  homeAboutIntro: "aboutIntro.json",
  homeServices: "services.json",
  homeSupportServices: "supportServices.json",
  navbar: "navbar.json",
  aboutPage: "aboutPage.json",
  servicesPage: "servicesPage.json",
  schedulePage: "schedulePage.json",
  staffPage: "staffPage.json",
  contactPage: "contactPage.json",
};

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
    const key = String(body.key || "");
    const data = body.data;

    const fileName = fileMap[key];

    if (!fileName) {
      return NextResponse.json(
        { message: "Invalid admin UI page key." },
        { status: 400 },
      );
    }

    const filePath = path.join(process.cwd(), "app", "data", fileName);

    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      message: "Content saved successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to save content.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
