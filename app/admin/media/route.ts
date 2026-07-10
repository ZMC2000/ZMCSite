import { auth } from "@/auth";
import { NextResponse } from "next/server";
import path from "path";
import { readdir } from "fs/promises";

export const runtime = "nodejs";

const publicPath = path.join(process.cwd(), "public");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

async function getImagesFromDirectory(directoryPath: string, basePath = "") {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const images: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    const publicUrl = `${basePath}/${entry.name}`;

    if (entry.isDirectory()) {
      const childImages = await getImagesFromDirectory(fullPath, publicUrl);
      images.push(...childImages);
      continue;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();

      if (allowedExtensions.includes(extension)) {
        images.push(publicUrl);
      }
    }
  }

  return images;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized. Please login again.", images: [] },
        { status: 401 },
      );
    }

    const images = await getImagesFromDirectory(publicPath);

    return NextResponse.json({
      images: images.sort(),
    });
  } catch (error) {
    console.error("MEDIA API GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load public images.",
        path: publicPath,
        error: error instanceof Error ? error.message : String(error),
        images: [],
      },
      { status: 500 },
    );
  }
}
